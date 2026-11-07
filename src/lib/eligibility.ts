import { EligibilityReport, RuleEvaluation, Scholarship, StudentProfile } from '@/types';

export function evaluateScholarshipEligibility(
  scholarship: Scholarship,
  profile: StudentProfile | null
): EligibilityReport {
  const disclaimer =
    'GRANTLY Smart Eligibility Checker provides preliminary assessment based on declared criteria. Official award decisions rest solely with the scholarship governing authority.';

  if (!profile || !profile.onboardingCompleted) {
    return {
      scholarshipId: scholarship.id,
      status: 'PROFILE_INCOMPLETE',
      overallScore: 0,
      rules: [],
      satisfiedCount: 0,
      failedCount: 0,
      missingCount: 0,
      explanation: 'Complete your student profile to automatically evaluate your eligibility for this scholarship.',
      actionItems: ['Complete your onboarding profile with education, academic score, and income details.'],
      disclaimer,
    };
  }

  const rules: RuleEvaluation[] = [];
  const criteria = scholarship.eligibilityCriteria;

  // 1. Education Level Rule
  if (criteria.educationLevels && criteria.educationLevels.length > 0) {
    const studentLevel = profile.educationLevel;
    const matchesLevel = criteria.educationLevels.includes(studentLevel);
    rules.push({
      id: 'rule-education-level',
      name: 'Education Level',
      description: 'Applicable education stage or academic level',
      studentValue: studentLevel || 'Not specified',
      requiredValue: criteria.educationLevels.join(', '),
      status: !studentLevel ? 'missing_info' : matchesLevel ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  // 2. Minimum Percentage / CGPA Rule
  if (criteria.minPercentage !== undefined) {
    const studentScore = profile.percentageOrCgpa;
    const hasScore = studentScore !== undefined && studentScore > 0;
    const passed = hasScore && studentScore >= criteria.minPercentage;
    rules.push({
      id: 'rule-academic-score',
      name: 'Minimum Academic Marks',
      description: 'Minimum academic performance in previous qualifying exam',
      studentValue: hasScore ? `${studentScore}%` : 'Not provided',
      requiredValue: `At least ${criteria.minPercentage}%`,
      status: !hasScore ? 'missing_info' : passed ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  // 3. Family Income Ceiling Rule
  if (criteria.maxIncome !== undefined) {
    const studentIncome = profile.annualFamilyIncome;
    const hasIncome = studentIncome !== undefined && studentIncome >= 0;
    const passed = hasIncome && studentIncome <= criteria.maxIncome;
    const formatInr = (val: number) => `₹${val.toLocaleString('en-IN')}`;
    rules.push({
      id: 'rule-family-income',
      name: 'Family Income Limit',
      description: 'Maximum annual household income ceiling',
      studentValue: hasIncome ? `${formatInr(studentIncome)} / year` : 'Not declared',
      requiredValue: `Max ${formatInr(criteria.maxIncome)} / year`,
      status: !hasIncome ? 'missing_info' : passed ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  // 4. Gender Requirement Rule
  if (criteria.gender && criteria.gender !== 'Any') {
    const studentGender = profile.gender;
    const hasGender = !!studentGender && studentGender !== 'prefer_not_to_say';
    const passed = hasGender && studentGender.toLowerCase() === criteria.gender.toLowerCase();
    rules.push({
      id: 'rule-gender',
      name: 'Gender Eligibility',
      description: 'Scholarship specific gender criteria',
      studentValue: studentGender ? (studentGender.charAt(0).toUpperCase() + studentGender.slice(1)) : 'Not specified',
      requiredValue: criteria.gender === 'female' ? 'Female Students Only' : `${criteria.gender} only`,
      status: !hasGender ? 'missing_info' : passed ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  // 5. State / Domicile Rule
  if (criteria.states && criteria.states.length > 0 && !criteria.states.includes('All India')) {
    const studentState = profile.state;
    const hasState = !!studentState && studentState.trim() !== '';
    const passed = hasState && criteria.states.includes(studentState);
    rules.push({
      id: 'rule-state-domicile',
      name: 'State / Domicile',
      description: 'Geographical residency or domicile requirement',
      studentValue: studentState || 'Not selected',
      requiredValue: criteria.states.join(', '),
      status: !hasState ? 'missing_info' : passed ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  } else {
    // All India is satisfied
    rules.push({
      id: 'rule-state-domicile-all',
      name: 'Geographic Scope',
      description: 'Eligible domicile or residency',
      studentValue: profile.state || 'All India',
      requiredValue: 'Open to all Indian States & UTs',
      status: 'satisfied',
      isMandatory: false,
    });
  }

  // 6. Social Category Rule
  if (criteria.categories && criteria.categories.length > 0 && !criteria.categories.includes('General')) {
    const studentCat = profile.category;
    const hasCat = !!studentCat;
    const passed = hasCat && criteria.categories.includes(studentCat);
    rules.push({
      id: 'rule-social-category',
      name: 'Social Category',
      description: 'Specific category quota or welfare scheme',
      studentValue: studentCat || 'Not specified',
      requiredValue: criteria.categories.join(', '),
      status: !hasCat ? 'missing_info' : passed ? 'satisfied' : 'failed',
      isMandatory: true,
    });
  }

  // Calculate totals
  const satisfiedCount = rules.filter((r) => r.status === 'satisfied').length;
  const failedCount = rules.filter((r) => r.status === 'failed' && r.isMandatory).length;
  const missingCount = rules.filter((r) => r.status === 'missing_info').length;

  let overallStatus: EligibilityReport['status'] = 'ELIGIBLE';
  let explanation = '';
  const actionItems: string[] = [];

  if (failedCount > 0) {
    overallStatus = 'NOT_ELIGIBLE';
    const failedRuleNames = rules
      .filter((r) => r.status === 'failed' && r.isMandatory)
      .map((r) => r.name)
      .join(', ');
    explanation = `You do not currently satisfy mandatory criteria: ${failedRuleNames}.`;
    actionItems.push('Review the specific requirements that did not match your current profile.');
  } else if (missingCount > 0) {
    overallStatus = 'POTENTIALLY_ELIGIBLE';
    const missingRuleNames = rules
      .filter((r) => r.status === 'missing_info')
      .map((r) => r.name)
      .join(', ');
    explanation = `You appear to match all verified criteria, but ${missingCount} condition(s) require missing profile details: ${missingRuleNames}.`;
    actionItems.push('Update your student profile with the missing information to verify full eligibility.');
  } else {
    overallStatus = 'ELIGIBLE';
    explanation =
      'Congratulations! Your current student profile satisfies all declared mandatory eligibility criteria for this scholarship.';
    actionItems.push('Gather the required application documents and proceed with your application.');
  }

  const overallScore = rules.length > 0 ? Math.round((satisfiedCount / rules.length) * 100) : 0;

  return {
    scholarshipId: scholarship.id,
    status: overallStatus,
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

