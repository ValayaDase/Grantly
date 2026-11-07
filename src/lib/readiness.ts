import { ApplicationReadiness, DocumentItem, Scholarship, StudentProfile } from '@/types';
import { evaluateScholarshipEligibility } from './eligibility';

export function calculateApplicationReadiness(
  scholarship: Scholarship,
  profile: StudentProfile | null,
  userDocuments: DocumentItem[]
): ApplicationReadiness {
  const checklistItems: ApplicationReadiness['checklistItems'] = [];
  const requiredDocs = scholarship.requiredDocuments || [];
  const uploadedDocTypes = new Set<string>(userDocuments.map((d) => d.documentType));

  // 1. Profile Completion Check
  const hasProfile = Boolean(profile && profile.onboardingCompleted);
  checklistItems.push({
    label: hasProfile ? 'Student profile completed with academic & income details' : 'Complete student profile',
    completed: hasProfile,
    type: 'profile',
  });

  // 2. Eligibility Evaluation Check
  const eligibility = evaluateScholarshipEligibility(scholarship, profile);
  const isEligibleOrPotential = eligibility.status === 'ELIGIBLE' || eligibility.status === 'POTENTIALLY_ELIGIBLE';
  checklistItems.push({
    label:
      eligibility.status === 'ELIGIBLE'
        ? 'Eligibility verified: All mandatory conditions met'
        : eligibility.status === 'POTENTIALLY_ELIGIBLE'
        ? 'Potentially eligible (some profile fields need review)'
        : 'Eligibility review: Mandatory criteria not satisfied',
    completed: isEligibleOrPotential,
    type: 'eligibility',
  });

  // 3. Document Vault Matching
  const missingDocuments: string[] = [];
  let uploadedCount = 0;

  for (const docType of requiredDocs) {
    const isUploaded = uploadedDocTypes.has(docType);
    if (isUploaded) {
      uploadedCount++;
      checklistItems.push({
        label: `${docType} uploaded in Document Vault`,
        completed: true,
        type: 'document',
      });
    } else {
      missingDocuments.push(docType);
      checklistItems.push({
        label: `${docType} required (Missing in Document Vault)`,
        completed: false,
        type: 'document',
      });
    }
  }

  // 4. Final Review
  checklistItems.push({
    label: 'Official application guidelines and deadlines reviewed',
    completed: true,
    type: 'review',
  });

  // Calculate score
  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter((i) => i.completed).length;
  const score = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    scholarshipId: scholarship.id,
    score,
    isReadyToApply: score >= 80,
    profileCompleted: hasProfile,
    documentsUploadedCount: uploadedCount,
    totalRequiredDocuments: requiredDocs.length,
    missingDocuments,
    checklistItems,
  };
}
