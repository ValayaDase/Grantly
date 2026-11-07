import { Scholarship, StudentProfile } from '@/types';
import { evaluateScholarshipEligibility } from './eligibility';
import { calculateMatchScore } from './matchScore';
import { getDeadlineInfo } from './deadline';

export interface RecommendedScholarship {
  scholarship: Scholarship;
  matchScore: number;
  eligibilityStatus: string;
  recommendationReason: string;
  badge: 'Best Match' | 'Closing Soon' | 'High Value' | 'Top Government' | 'Diversity Focus';
}

export function getRecommendedScholarships(
  scholarships: Scholarship[],
  profile: StudentProfile | null,
  limit: number = 6
): RecommendedScholarship[] {
  const scored = scholarships.map((scholarship) => {
    const match = calculateMatchScore(scholarship, profile);
    const eligibility = evaluateScholarshipEligibility(scholarship, profile);
    const deadline = getDeadlineInfo(scholarship.deadline);

    // Composite ranking score
    let rank = match.totalScore;
    if (eligibility.status === 'ELIGIBLE') rank += 30;
    if (eligibility.status === 'POTENTIALLY_ELIGIBLE') rank += 10;
    if (eligibility.status === 'NOT_ELIGIBLE') rank -= 50;
    if (deadline.isClosingSoon) rank += 15;
    if (scholarship.amount >= 100000) rank += 10;

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
    if (match.reasons.length > 0) {
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
    };
  });

  // Sort descending by calculated rank
  scored.sort((a, b) => b.rank - a.rank);

  return scored.slice(0, limit);
}

