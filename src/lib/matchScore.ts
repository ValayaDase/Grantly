import type { MatchScoreBreakdown, Scholarship, StudentProfile } from '@/types';
import { evaluateScholarshipEligibility } from './eligibility';

const EMPTY_BREAKDOWN: Omit<MatchScoreBreakdown, 'reasons'> = {
  totalScore: 0,
  educationMatch: 0,
  academicScoreMatch: 0,
  financialNeedMatch: 0,
  categoryGenderMatch: 0,
  stateLocationMatch: 0,
};

export function calculateMatchScore(
  scholarship: Scholarship,
  profile: StudentProfile | null
): MatchScoreBreakdown {
  if (!profile || !profile.onboardingCompleted) {
    return {
      ...EMPTY_BREAKDOWN,
      reasons: ['Complete your profile to calculate a meaningful match score.'],
    };
  }

  const criteria = scholarship.eligibilityCriteria;
  const reasons: string[] = [];

  const educationMatch = !criteria.educationLevels?.length || criteria.educationLevels.includes(profile.educationLevel)
    ? 20
    : 0;
  reasons.push(educationMatch > 0
    ? criteria.educationLevels?.length ? `Education level matches (${profile.educationLevel}).` : 'No education-level restriction is recorded.'
    : `Education level does not match (${profile.educationLevel}).`);

  let academicScoreMatch = 20;
  const academicScore = profile.percentageOrCgpa;
  if (criteria.minPercentage !== undefined) {
    if (!Number.isFinite(academicScore) || academicScore < 0 || academicScore > 100) {
      academicScoreMatch = 0;
      reasons.push('Add a valid academic percentage to assess this requirement.');
    } else if (academicScore >= criteria.minPercentage + 15) {
      academicScoreMatch = 25;
      reasons.push(`Academic score exceeds the ${criteria.minPercentage}% minimum.`);
    } else if (academicScore >= criteria.minPercentage) {
      academicScoreMatch = 20;
      reasons.push(`Academic score meets the ${criteria.minPercentage}% minimum.`);
    } else if (academicScore >= criteria.minPercentage - 5) {
      academicScoreMatch = 8;
      reasons.push(`Academic score is slightly below the ${criteria.minPercentage}% minimum.`);
    } else {
      academicScoreMatch = 0;
      reasons.push(`Academic score is below the ${criteria.minPercentage}% minimum.`);
    }
  } else {
    reasons.push('No minimum academic score is recorded.');
  }

  let financialNeedMatch = 20;
  const income = profile.annualFamilyIncome;
  if (criteria.maxIncome !== undefined) {
    if (!Number.isFinite(income) || income < 0) {
      financialNeedMatch = 0;
      reasons.push('Add a valid annual household income to assess this requirement.');
    } else if (income <= criteria.maxIncome * 0.5) {
      financialNeedMatch = 25;
      reasons.push('Annual household income is within the lower half of the recorded income ceiling.');
    } else if (income <= criteria.maxIncome) {
      financialNeedMatch = 20;
      reasons.push('Annual household income is within the recorded ceiling.');
    } else {
      financialNeedMatch = 0;
      reasons.push('Annual household income exceeds the recorded ceiling.');
    }
  } else {
    reasons.push('No income ceiling is recorded.');
  }

  const categoryRestricted = Boolean(criteria.categories?.length);
  const categoryMatch = !categoryRestricted || criteria.categories!.includes(profile.category);
  const genderRestricted = Boolean(criteria.gender && criteria.gender !== 'Any');
  const genderMatch = !genderRestricted || profile.gender === criteria.gender;
  const categoryGenderMatch = Math.round((categoryMatch ? 7.5 : 0) + (genderMatch ? 7.5 : 0));
  if (categoryRestricted) reasons.push(categoryMatch
    ? `Social category matches (${profile.category}).`
    : `Social category does not match the recorded categories (${profile.category}).`);
  if (genderRestricted) reasons.push(genderMatch
    ? `Gender matches the recorded ${criteria.gender} requirement.`
    : `Gender does not match the recorded ${criteria.gender} requirement.`);
  if (!categoryRestricted && !genderRestricted) reasons.push('No category or gender restriction is recorded.');

  const stateLocationMatch = !criteria.states?.length || criteria.states.includes('All India') || criteria.states.includes(profile.state)
    ? 15
    : 0;
  reasons.push(stateLocationMatch > 0
    ? criteria.states?.length ? 'Domicile is within the recorded geographic scope.' : 'No state restriction is recorded.'
    : `Domicile does not match the recorded states (${profile.state}).`);

  const rawScore = educationMatch + academicScoreMatch + financialNeedMatch + categoryGenderMatch + stateLocationMatch;
  const eligibility = evaluateScholarshipEligibility(scholarship, profile);
  const totalScore = eligibility.status === 'NOT_ELIGIBLE' ? Math.min(49, rawScore) : rawScore;
  if (eligibility.status === 'NOT_ELIGIBLE') {
    reasons.push('The match score is capped because at least one mandatory eligibility rule is not met.');
  } else if (eligibility.status === 'POTENTIALLY_ELIGIBLE') {
    reasons.push('Some mandatory eligibility details are missing; confirm them before relying on this score.');
  }

  if (profile.preferredScholarshipCategories?.includes(scholarship.category)) {
    reasons.push(`Matches your ${scholarship.category} preference.`);
  }

  return {
    totalScore: Math.max(0, Math.min(100, totalScore)),
    educationMatch,
    academicScoreMatch,
    financialNeedMatch,
    categoryGenderMatch,
    stateLocationMatch,
    reasons,
  };
}
