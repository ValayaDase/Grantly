import { describe, it, expect } from 'vitest';
import { calculateApplicationReadiness } from '@/lib/readiness';
import { SCHOLARSHIPS_DATA } from '@/data/scholarships';
import { DEMO_STUDENT_PROFILE } from '@/data/mockStudent';
import type { DocumentItem, StudentProfile } from '@/types';

describe('calculateApplicationReadiness', () => {
  const scholarship = SCHOLARSHIPS_DATA[0];

  it('reports not ready when profile is null', () => {
    const readiness = calculateApplicationReadiness(scholarship, null, []);
    expect(readiness.isReadyToApply).toBe(false);
    expect(readiness.profileCompleted).toBe(false);
  });

  it('identifies missing documents and calculates correct counts', () => {
    const readiness = calculateApplicationReadiness(scholarship, DEMO_STUDENT_PROFILE, []);
    expect(readiness.isReadyToApply).toBe(false);
    expect(readiness.documentsUploadedCount).toBe(0);
    expect(readiness.missingDocuments.length).toBeGreaterThan(0);
  });

  it('marks ready only when profile is completed, eligibility is satisfied, and all documents are uploaded', () => {
    // Create matching user documents for all required documents
    const mockUserDocs: DocumentItem[] = (scholarship.requiredDocuments ?? []).map((docType, idx) => ({
      id: `doc-${idx}`,
      documentType: docType as DocumentItem['documentType'],
      fileName: `${docType.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      fileSize: '1.2 MB',
      fileType: 'application/pdf',
      uploadedAt: '2026-11-01',
      verified: true,
    }));

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

    const readiness = calculateApplicationReadiness(scholarship, eligibleProfile, mockUserDocs);
    expect(readiness.missingDocuments).toHaveLength(0);
    expect(readiness.documentsUploadedCount).toBe(scholarship.requiredDocuments.length);
    expect(readiness.isReadyToApply).toBe(true);
    expect(readiness.score).toBe(100);
  });
});
