import { describe, it, expect } from 'vitest';
import { evaluateScholarshipEligibility } from '@/lib/eligibility';
import { SCHOLARSHIPS_DATA } from '@/data/scholarships';
import { DEMO_STUDENT_PROFILE } from '@/data/mockStudent';
import type { Scholarship, StudentProfile } from '@/types';

describe('evaluateScholarshipEligibility', () => {
  const baseScholarship = SCHOLARSHIPS_DATA[0];

  it('returns PROFILE_INCOMPLETE when profile is null', () => {
    const report = evaluateScholarshipEligibility(baseScholarship, null);
    expect(report.status).toBe('PROFILE_INCOMPLETE');
    expect(report.overallScore).toBe(0);
    expect(report.rules).toHaveLength(0);
  });

  it('returns PROFILE_INCOMPLETE when onboarding is not completed', () => {
    const incompleteProfile: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      onboardingCompleted: false,
    };
    const report = evaluateScholarshipEligibility(baseScholarship, incompleteProfile);
    expect(report.status).toBe('PROFILE_INCOMPLETE');
  });

  it('evaluates fully eligible student correctly', () => {
    const eligibleProfile: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      onboardingCompleted: true,
      educationLevel: 'Undergraduate',
      percentageOrCgpa: 85,
      annualFamilyIncome: 200000,
      gender: 'male',
      state: 'Maharashtra',
      category: 'General',
    };
    const report = evaluateScholarshipEligibility(baseScholarship, eligibleProfile);
    expect(report.status).toBe('ELIGIBLE');
    expect(report.failedCount).toBe(0);
    expect(report.overallScore).toBeGreaterThan(0);
  });

  it('flags NOT_ELIGIBLE when academic percentage is below requirement', () => {
    const strictScholarship: Scholarship = {
      ...baseScholarship,
      eligibilityCriteria: {
        ...baseScholarship.eligibilityCriteria,
        minPercentage: 90,
      },
    };
    const profile: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      onboardingCompleted: true,
      percentageOrCgpa: 75,
    };
    const report = evaluateScholarshipEligibility(strictScholarship, profile);
    expect(report.status).toBe('NOT_ELIGIBLE');
    expect(report.failedCount).toBeGreaterThanOrEqual(1);
    const academicRule = report.rules.find((r) => r.id === 'rule-academic-score');
    expect(academicRule?.status).toBe('failed');
  });

  it('flags NOT_ELIGIBLE when family income exceeds ceiling', () => {
    const needScholarship: Scholarship = {
      ...baseScholarship,
      eligibilityCriteria: {
        ...baseScholarship.eligibilityCriteria,
        maxIncome: 250000,
      },
    };
    const highIncomeProfile: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      onboardingCompleted: true,
      annualFamilyIncome: 600000,
    };
    const report = evaluateScholarshipEligibility(needScholarship, highIncomeProfile);
    expect(report.status).toBe('NOT_ELIGIBLE');
    const incomeRule = report.rules.find((r) => r.id === 'rule-family-income');
    expect(incomeRule?.status).toBe('failed');
  });

  it('flags gender restriction properly for female-only scholarships', () => {
    const femaleScholarship: Scholarship = {
      ...baseScholarship,
      eligibilityCriteria: {
        ...baseScholarship.eligibilityCriteria,
        gender: 'female',
      },
    };
    const maleProfile: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      onboardingCompleted: true,
      gender: 'male',
    };
    const report = evaluateScholarshipEligibility(femaleScholarship, maleProfile);
    expect(report.status).toBe('NOT_ELIGIBLE');
    const genderRule = report.rules.find((r) => r.id === 'rule-gender');
    expect(genderRule?.status).toBe('failed');
  });

  it('supports differently abled reservation check', () => {
    const disabilityScholarship: Scholarship = {
      ...baseScholarship,
      eligibilityCriteria: {
        ...baseScholarship.eligibilityCriteria,
        isDifferentlyAbledOnly: true,
      },
    };
    const nonDisabilityProfile: StudentProfile = {
      ...DEMO_STUDENT_PROFILE,
      onboardingCompleted: true,
      isDifferentlyAbled: false,
    };
    const report = evaluateScholarshipEligibility(disabilityScholarship, nonDisabilityProfile);
    expect(report.status).toBe('NOT_ELIGIBLE');
    const disabilityRule = report.rules.find((r) => r.id === 'rule-disability');
    expect(disabilityRule?.status).toBe('failed');
  });
});

