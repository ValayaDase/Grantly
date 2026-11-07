import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '@/lib/matchScore';
import { SCHOLARSHIPS_DATA } from '@/data/scholarships';
import { DEMO_STUDENT_PROFILE } from '@/data/mockStudent';
import type { StudentProfile } from '@/types';

describe('calculateMatchScore', () => {
  const scholarship = SCHOLARSHIPS_DATA[0];

  it('returns 0 totalScore for null profile', () => {
    const result = calculateMatchScore(scholarship, null);
    expect(result.totalScore).toBe(0);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('returns 0 totalScore for incomplete onboarding', () => {
    const incomplete: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      onboardingCompleted: false,
    };
    const result = calculateMatchScore(scholarship, incomplete);
    expect(result.totalScore).toBe(0);
  });

  it('awards high score for well-matched candidate', () => {
    const result = calculateMatchScore(scholarship, DEMO_STUDENT_PROFILE);
    expect(result.totalScore).toBeGreaterThanOrEqual(50);
    expect(result.educationMatch).toBeGreaterThan(0);
    expect(result.academicScoreMatch).toBeGreaterThan(0);
  });

  it('caps match score at max 49 for completely ineligible candidates', () => {
    const mismatchedProfile: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      onboardingCompleted: true,
      percentageOrCgpa: 40, // Fails min percentage requirement
      annualFamilyIncome: 1500000, // Fails max income ceiling
    };
    const result = calculateMatchScore(scholarship, mismatchedProfile);
    expect(result.totalScore).toBeLessThanOrEqual(49);
  });
});

