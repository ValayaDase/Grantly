import type { ApplicationReadiness, DocumentItem, Scholarship, StudentProfile } from '@/types';
import { evaluateScholarshipEligibility } from './eligibility';

export function calculateApplicationReadiness(
  scholarship: Scholarship,
  profile: StudentProfile | null,
  userDocuments: DocumentItem[]
): ApplicationReadiness {
  const checklistItems: ApplicationReadiness['checklistItems'] = [];
  const requiredDocs = [...new Set(scholarship.requiredDocuments ?? [])];
  const uploadedDocTypes = new Set<string>(userDocuments.map((document) => document.documentType));
  const profileCompleted = Boolean(profile?.onboardingCompleted);

  checklistItems.push({
    label: profileCompleted ? 'Student profile completed' : 'Complete student profile',
    completed: profileCompleted,
    type: 'profile',
  });

  const eligibility = evaluateScholarshipEligibility(scholarship, profile);
  const eligibilityPassed = eligibility.status === 'ELIGIBLE';
  checklistItems.push({
    label: eligibility.status === 'ELIGIBLE'
      ? 'Recorded mandatory eligibility criteria are satisfied'
      : eligibility.status === 'POTENTIALLY_ELIGIBLE'
        ? 'Complete missing details to confirm eligibility'
        : eligibility.status === 'NOT_ELIGIBLE'
          ? 'Review failed mandatory eligibility criteria'
          : 'Complete your profile to assess eligibility',
    completed: eligibilityPassed,
    type: 'eligibility',
  });

  const missingDocuments: string[] = [];
  let uploadedCount = 0;
  for (const documentType of requiredDocs) {
    const uploaded = uploadedDocTypes.has(documentType);
    if (uploaded) uploadedCount += 1;
    else missingDocuments.push(documentType);
    checklistItems.push({
      label: uploaded ? `${documentType} recorded in Document Vault` : `Add ${documentType} to Document Vault`,
      completed: uploaded,
      type: 'document',
    });
  }

  // Score only concrete preparation items. Readiness itself requires every
  // blocker to be cleared; a percentage alone must never imply eligibility.
  const score = checklistItems.length
    ? Math.round((checklistItems.filter((item) => item.completed).length / checklistItems.length) * 100)
    : 0;
  const isReadyToApply = profileCompleted && eligibilityPassed && missingDocuments.length === 0;

  return {
    scholarshipId: scholarship.id,
    score,
    isReadyToApply,
    profileCompleted,
    documentsUploadedCount: uploadedCount,
    totalRequiredDocuments: requiredDocs.length,
    missingDocuments,
    checklistItems,
  };
}
