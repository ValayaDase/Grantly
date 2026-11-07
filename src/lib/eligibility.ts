import type { EligibilityReport, RuleEvaluation, Scholarship, StudentProfile } from '@/types';

function calculateAge(dateOfBirth: string, today: Date): number | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  if (!dateMatch) return null;
  const [, yearValue, monthValue, dayValue] = dateMatch;
  const birthYear = Number(yearValue);
  const birthMonth = Number(monthValue);
  const birthDay = Number(dayValue);
  const birthDate = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay));
  if (birthDate.getUTCFullYear() !== birthYear || birthDate.getUTCMonth() !== birthMonth - 1 || birthDate.getUTCDate() !== birthDay) return null;

  const todayParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(today);
  const todayValues = Object.fromEntries(todayParts.map((part) => [part.type, part.value]));
  const todayYear = Number(todayValues.year);
  const todayMonth = Number(todayValues.month);
  const todayDay = Number(todayValues.day);
  const todayDate = new Date(Date.UTC(todayYear, todayMonth - 1, todayDay));
  if (birthDate > todayDate) return null;

  let age = todayYear - birthYear;
  const birthdayHasPassed =
    todayMonth > birthMonth ||
    (todayMonth === birthMonth && todayDay >= birthDay);
  if (!birthdayHasPassed) age -= 1;
  return age;
}

const STABLE_REFERENCE_DATE = new Date('2026-11-07T00:00:00Z');

export function evaluateScholarshipEligibility(
  scholarship: Scholarship,
  profile: StudentProfile | null,
  referenceDate: Date = STABLE_REFERENCE_DATE
): EligibilityReport {
  const disclaimer =
    'This preliminary assessment compares your profile with the criteria recorded in GRANTLY. Confirm current requirements with the scholarship provider before applying.';

  if (!profile || !profile.onboardingCompleted) {
    return {
      scholarshipId: scholarship.id,
      status: 'PROFILE_INCOMPLETE',
      overallScore: 0,
      rules: [],
      satisfiedCount: 0,
      failedCount: 0,
      missingCount: 0,
      explanation: 'Complete your student profile to evaluate the criteria recorded for this scholarship.',
      actionItems: ['Complete your profile with education, marks, income, domicile, and other requested details.'],
      disclaimer,
    };
  }

  const rules: RuleEvaluation[] = [];
  const criteria = scholarship.eligibilityCriteria;
  const addRule = (
    rule: Omit<RuleEvaluation, 'id'> & { id: string }
  ) => rules.push(rule);

  if (criteria.educationLevels?.length) {
    addRule({
      id: 'rule-education-level',
      name: 'Education Level',
      description: 'Applicable education stage or academic level',
      studentValue: profile.educationLevel || 'Not provided',
      requiredValue: criteria.educationLevels.join(', '),
      status: profile.educationLevel
        ? criteria.educationLevels.includes(profile.educationLevel) ? 'satisfied' : 'failed'
        : 'missing_info',
      isMandatory: true,
    });
  }

  if (criteria.minPercentage !== undefined) {
    const score = profile.percentageOrCgpa;
    const hasScore = Number.isFinite(score) && score >= 0 && score <= 100;
    addRule({
      id: 'rule-academic-score',
      name: 'Minimum Academic Marks',
      description: 'Minimum academic performance in the qualifying exam',
      studentValue: hasScore ? `${score}%` : 'Not provided',
      requiredValue: `At least ${criteria.minPercentage}%`,
      status: !hasScore ? 'missing_info' : score >= criteria.minPercentage ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  if (criteria.maxIncome !== undefined) {
    const income = profile.annualFamilyIncome;
    const hasIncome = Number.isFinite(income) && income >= 0;
    const formatInr = (value: number) => `₹${value.toLocaleString('en-IN')}`;
    addRule({
      id: 'rule-family-income',
      name: 'Family Income Limit',
      description: 'Maximum annual household income ceiling',
      studentValue: hasIncome ? `${formatInr(income)} / year` : 'Not provided',
      requiredValue: `Max ${formatInr(criteria.maxIncome)} / year`,
      status: !hasIncome ? 'missing_info' : income <= criteria.maxIncome ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  if (criteria.gender && criteria.gender !== 'Any') {
    const gender = profile.gender;
    const hasGender = Boolean(gender) && gender !== 'prefer_not_to_say';
    addRule({
      id: 'rule-gender',
      name: 'Gender Eligibility',
      description: 'Scholarship-specific gender criteria',
      studentValue: gender ? gender.replaceAll('_', ' ') : 'Not provided',
      requiredValue: criteria.gender === 'female' ? 'Female students only' : `${criteria.gender} only`,
      status: !hasGender ? 'missing_info' : gender === criteria.gender ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  if (criteria.states?.length && !criteria.states.includes('All India')) {
    const state = profile.state?.trim();
    addRule({
      id: 'rule-state-domicile',
      name: 'State / Domicile',
      description: 'Geographical residency or domicile requirement',
      studentValue: state || 'Not provided',
      requiredValue: criteria.states.join(', '),
      status: !state ? 'missing_info' : criteria.states.includes(state) ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  } else if (criteria.states?.includes('All India')) {
    addRule({
      id: 'rule-state-domicile-all',
      name: 'Geographic Scope',
      description: 'Eligible domicile or residency',
      studentValue: profile.state || 'Not provided',
      requiredValue: 'Open to all Indian States & UTs',
      status: profile.state?.trim() ? 'satisfied' : 'missing_info',
      isMandatory: false,
    });
  }

  if (criteria.categories?.length) {
    const category = profile.category;
    addRule({
      id: 'rule-social-category',
      name: 'Social Category',
      description: 'Specific category quota or welfare scheme',
      studentValue: category || 'Not provided',
      requiredValue: criteria.categories.join(', '),
      status: !category ? 'missing_info' : criteria.categories.includes(category) ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  const allowedCourses = criteria.coursesAllowed?.filter((course) => course.toLowerCase() !== 'all');
  if (allowedCourses?.length) {
    const course = profile.courseStream?.trim();
    const normalizedCourse = course?.toLocaleLowerCase();
    const matchesCourse = Boolean(normalizedCourse && allowedCourses.some((allowed) => {
      const normalizedAllowed = allowed.toLocaleLowerCase();
      return normalizedCourse.includes(normalizedAllowed) || normalizedAllowed.includes(normalizedCourse);
    }));
    addRule({
      id: 'rule-course',
      name: 'Course / Stream',
      description: 'Course or academic stream accepted by the scholarship',
      studentValue: course || 'Not provided',
      requiredValue: allowedCourses.join(', '),
      status: !course ? 'missing_info' : matchesCourse ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  if (criteria.isDifferentlyAbledOnly) {
    addRule({
      id: 'rule-disability',
      name: 'Disability Eligibility',
      description: 'Scholarship reserved for students with disabilities',
      studentValue: profile.isDifferentlyAbled ? 'Yes' : 'No',
      requiredValue: 'Student must identify as differently abled',
      status: profile.isDifferentlyAbled ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  const age = profile.dob ? calculateAge(profile.dob, referenceDate) : null;
  if (criteria.minAge !== undefined || criteria.maxAge !== undefined) {
    const requiredAge = [
      criteria.minAge !== undefined ? `at least ${criteria.minAge}` : undefined,
      criteria.maxAge !== undefined ? `at most ${criteria.maxAge}` : undefined,
    ].filter(Boolean).join(' and ');
    const meetsAge = age !== null &&
      (criteria.minAge === undefined || age >= criteria.minAge) &&
      (criteria.maxAge === undefined || age <= criteria.maxAge);
    addRule({
      id: 'rule-age',
      name: 'Age Requirement',
      description: 'Age calculated from date of birth and the current date',
      studentValue: age === null ? 'Not provided or invalid date of birth' : `${age} years`,
      requiredValue: requiredAge,
      status: age === null ? 'missing_info' : meetsAge ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  const mandatoryRules = rules.filter((rule) => rule.isMandatory);
  const satisfiedCount = rules.filter((rule) => rule.status === 'satisfied').length;
  const failedCount = mandatoryRules.filter((rule) => rule.status === 'failed').length;
  const missingCount = mandatoryRules.filter((rule) => rule.status === 'missing_info').length;

  let status: EligibilityReport['status'];
  let explanation: string;
  const actionItems: string[] = [];

  if (failedCount > 0) {
    status = 'NOT_ELIGIBLE';
    const failedNames = mandatoryRules.filter((rule) => rule.status === 'failed').map((rule) => rule.name);
    explanation = `Your profile does not meet these recorded mandatory criteria: ${failedNames.join(', ')}.`;
    actionItems.push('Review the failed criteria and confirm them against the scholarship provider’s current rules.');
  } else if (missingCount > 0) {
    status = 'POTENTIALLY_ELIGIBLE';
    const missingNames = mandatoryRules.filter((rule) => rule.status === 'missing_info').map((rule) => rule.name);
    explanation = `Some required profile details are missing: ${missingNames.join(', ')}.`;
    actionItems.push('Add the missing profile details to complete this preliminary assessment.');
  } else if (mandatoryRules.length === 0) {
    status = 'ELIGIBLE';
    explanation = 'No mandatory eligibility criteria are recorded for this scholarship. Confirm requirements with the provider.';
    actionItems.push('Review the official scholarship guidelines before applying.');
  } else {
    status = 'ELIGIBLE';
    explanation = 'Your current profile satisfies the mandatory criteria recorded for this scholarship.';
    actionItems.push('Review the provider’s current guidelines and gather the required documents.');
  }

  const overallScore = mandatoryRules.length > 0
    ? Math.round((mandatoryRules.filter((rule) => rule.status === 'satisfied').length / mandatoryRules.length) * 100)
    : 0;

  return {
    scholarshipId: scholarship.id,
    status,
    overallScore,
    rules,
    satisfiedCount,
    failedCount,
    missingCount,
    explanation,
    actionItems,
    disclaimer,
  };
}
