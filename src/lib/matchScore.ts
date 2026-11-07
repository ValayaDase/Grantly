import { MatchScoreBreakdown, Scholarship, StudentProfile } from '@/types';

export function calculateMatchScore(
  scholarship: Scholarship,
  profile: StudentProfile | null
): MatchScoreBreakdown {
  if (!profile || !profile.onboardingCompleted) {
    return {
      totalScore: 50, // default baseline
      educationMatch: 10,
      academicScoreMatch: 10,
      financialNeedMatch: 15,
      categoryGenderMatch: 10,
      stateLocationMatch: 5,
      reasons: ['Complete your profile to unlock an accurate AI Match Score calculation.'],
    };
  }

  let educationMatch = 0;
  let academicScoreMatch = 0;
  let financialNeedMatch = 0;
  let categoryGenderMatch = 0;
  let stateLocationMatch = 0;
  const reasons: string[] = [];

  const criteria = scholarship.eligibilityCriteria;

  // 1. Education Match (max 20 pts)
  if (!criteria.educationLevels || criteria.educationLevels.length === 0) {
    educationMatch = 20;
    reasons.push('Open to all educational tiers (+20 pts)');
  } else if (criteria.educationLevels.includes(profile.educationLevel)) {
    educationMatch = 20;
    reasons.push(`Direct level match for ${profile.educationLevel} (+20 pts)`);
  } else {
    educationMatch = 0;
  }

  // 2. Academic Score Match (max 25 pts)
  if (criteria.minPercentage === undefined) {
    academicScoreMatch = 20;
    reasons.push('No minimum percentage threshold required (+20 pts)');
  } else {
    const studentScore = profile.percentageOrCgpa || 0;
    if (studentScore >= criteria.minPercentage + 15) {
      academicScoreMatch = 25;
      reasons.push(`Your academic score of ${studentScore}% substantially exceeds the ${criteria.minPercentage}% benchmark (+25 pts)`);
    } else if (studentScore >= criteria.minPercentage) {
      academicScoreMatch = 20;
      reasons.push(`Your academic score (${studentScore}%) satisfies the ${criteria.minPercentage}% requirement (+20 pts)`);
    } else if (studentScore >= criteria.minPercentage - 5) {
      academicScoreMatch = 8;
      reasons.push(`Score (${studentScore}%) is slightly below the ${criteria.minPercentage}% threshold (+8 pts)`);
    } else {
      academicScoreMatch = 0;
    }
  }

  // 3. Financial Need Match (max 25 pts)
  if (criteria.maxIncome === undefined) {
    financialNeedMatch = 20;
    reasons.push('No income ceiling restrictions (+20 pts)');
  } else {
    const income = profile.annualFamilyIncome || 0;
    if (income <= criteria.maxIncome * 0.5) {
      financialNeedMatch = 25;
      reasons.push('Family income places you in highest priority income bracket (+25 pts)');
    } else if (income <= criteria.maxIncome) {
      financialNeedMatch = 20;
      reasons.push('Family income satisfies eligibility ceiling (+20 pts)');
    } else {
      financialNeedMatch = 0;
    }
  }

  // 4. Category & Gender Match (max 15 pts)
  let catScore = 7.5;
  let genderScore = 7.5;

  if (criteria.gender && criteria.gender !== 'Any') {
    if (profile.gender === criteria.gender) {
      genderScore = 7.5;
      reasons.push(`Matches specified ${criteria.gender} target group (+7.5 pts)`);
    } else {
      genderScore = 0;
    }
  }

  if (criteria.categories && criteria.categories.length > 0 && !criteria.categories.includes('General')) {
    if (criteria.categories.includes(profile.category)) {
      catScore = 7.5;
      reasons.push(`Category (${profile.category}) directly supported (+7.5 pts)`);
    } else {
      catScore = 0;
    }
  }

  categoryGenderMatch = Math.round(catScore + genderScore);

  // 5. State / Location Match (max 15 pts)
  if (!criteria.states || criteria.states.includes('All India')) {
    stateLocationMatch = 15;
    reasons.push('Pan-India eligibility applies (+15 pts)');
  } else if (criteria.states.includes(profile.state)) {
    stateLocationMatch = 15;
    reasons.push(`Resident of eligible state (${profile.state}) (+15 pts)`);
  } else {
    stateLocationMatch = 0;
  }

  // Category preferences bonus check
  if (profile.preferredScholarshipCategories && profile.preferredScholarshipCategories.includes(scholarship.category)) {
    reasons.push(`Matches your preference for ${scholarship.category} opportunities`);
  }

  const totalScore = Math.min(
    100,
    Math.max(0, educationMatch + academicScoreMatch + financialNeedMatch + categoryGenderMatch + stateLocationMatch)
  );

  return {
    totalScore,
    educationMatch,
    academicScoreMatch,
    financialNeedMatch,
    categoryGenderMatch,
    stateLocationMatch,
    reasons,
  };
}

