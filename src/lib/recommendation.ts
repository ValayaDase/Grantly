import type { EligibilityStatus, Scholarship, StudentProfile } from '@/types';
import { evaluateScholarshipEligibility } from './eligibility';
import { calculateMatchScore } from './matchScore';
import { getDeadlineInfo } from './deadline';

export interface RecommendedScholarship {
  scholarship: Scholarship;
  matchScore: number;
  eligibilityStatus: EligibilityStatus;
  recommendationReason: string;
  badge: 'Best Match' | 'Closing Soon' | 'High Value' | 'Top Government' | 'Diversity Focus';
}

export function getRecommendedScholarships(
  scholarships: Scholarship[],
  profile: StudentProfile | null,
  limit: number = 6
): RecommendedScholarship[] {
  const scored = scholarships.flatMap((scholarship) => {
    const match = calculateMatchScore(scholarship, profile);
    const eligibility = evaluateScholarshipEligibility(scholarship, profile);
    const deadline = getDeadlineInfo(scholarship.deadline);

    // Do not recommend an opportunity that fails a known mandatory criterion.
    if (eligibility.status === 'NOT_ELIGIBLE') return [];

    // Match fit drives ordering. Eligibility only breaks ties; deadline is
    // the final tie-breaker so urgency and award size cannot masquerade as fit.
    const rank = match.totalScore;

    // Pick badge
    let badge: RecommendedScholarship['badge'] = 'Best Match';
    if (deadline.isClosingSoon) {
      badge = 'Closing Soon';
    } else if (scholarship.amount >= 150000) {
      badge = 'High Value';
    } else if (scholarship.providerType === 'Government') {
      badge = 'Top Government';
    } else if (scholarship.category === 'Women Empowerment' || scholarship.category === 'Minority Welfare') {
      badge = 'Diversity Focus';
    }

    // Generate clear explanation
    let recommendationReason = '';
    if (eligibility.status === 'PROFILE_INCOMPLETE') {
      recommendationReason = 'Complete your profile to see personalized fit and eligibility details.';
    } else if (eligibility.status === 'POTENTIALLY_ELIGIBLE') {
      recommendationReason = eligibility.explanation;
    } else if (match.reasons.length > 0) {
      recommendationReason = match.reasons.slice(0, 2).join(' • ');
    } else {
      recommendationReason = `High-tier opportunity offering ${scholarship.amountFormatted}.`;
    }

    return {
      scholarship,
      matchScore: match.totalScore,
      eligibilityStatus: eligibility.status,
      recommendationReason,
      badge,
      rank,
      eligibleTieBreak: eligibility.status === 'ELIGIBLE' ? 1 : 0,
      deadlineTieBreak: deadline.daysRemaining >= 0 ? -deadline.daysRemaining : Number.NEGATIVE_INFINITY,
    };
  });

  scored.sort((a, b) =>
    b.rank - a.rank ||
    b.eligibleTieBreak - a.eligibleTieBreak ||
    b.deadlineTieBreak - a.deadlineTieBreak
  );

  return scored.slice(0, limit);
}

