export type EducationLevel =
  | 'School (Class 9-10)'
  | 'Higher Secondary (Class 11-12)'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'PhD / Research'
  | 'Diploma / Vocational';

export type IncomeCategory =
  | 'Below ₹1.5 Lakh'
  | '₹1.5 Lakh - ₹3 Lakh'
  | '₹3 Lakh - ₹6 Lakh'
  | '₹6 Lakh - ₹8 Lakh'
  | 'Above ₹8 Lakh';

export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  state: string;
  city: string;
  dob?: string;
  gender: Gender;
  educationLevel: EducationLevel;
  courseStream: string;
  institutionName: string;
  currentAcademicYear: string;
  percentageOrCgpa: number; // Stored as percentage 0-100
  annualFamilyIncome: number; // In INR
  incomeCategory: IncomeCategory;
  category: SocialCategory;
  isDifferentlyAbled: boolean;
  preferredScholarshipCategories: string[];
  preferredStudyLevel: string[];
  preferredLocation: string;
  scholarshipTypePreference: 'All' | 'Government Only' | 'Private Only';
  onboardingCompleted: boolean;
  updatedAt: string;
}

export type ProviderType = 'Government' | 'Private' | 'Trust / NGO' | 'Corporate CSR';

export type ScholarshipCategory =
  | 'Merit-Based'
  | 'Need-Based'
  | 'STEM & Tech'
  | 'Women Empowerment'
  | 'Minority Welfare'
  | 'Higher Education'
  | 'Research & Innovation';

export interface EligibilityCriteria {
  minPercentage?: number;
  maxIncome?: number; // annual family income in INR
  gender?: 'Any' | 'female' | 'male';
  states?: string[]; // e.g. ['All India'] or ['Maharashtra', 'Delhi']
  categories?: SocialCategory[]; // ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS']
  educationLevels?: EducationLevel[];
  coursesAllowed?: string[];
  isDifferentlyAbledOnly?: boolean;
  minAge?: number;
  maxAge?: number;
}

export interface ImportantDate {
  label: string;
  date: string;
  isPassed?: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  providerType: ProviderType;
  providerLogo?: string;
  amount: number; // numeric value in INR
  amountFormatted: string; // e.g. "₹50,000 / year"
  frequency: 'One-Time' | 'Annual' | 'Semester-wise' | 'Full Course Fee';
  deadline: string; // ISO format e.g. "2026-12-15"
  category: ScholarshipCategory;
  educationLevels: EducationLevel[];
  courses: string[];
  shortDescription: string;
  fullDescription: string;
  coverage: string;
  eligibilityCriteria: EligibilityCriteria;
  academicRequirements: string[];
  incomeRequirements: string;
  requiredDocuments: string[];
  applicationProcedure: string[];
  importantDates: ImportantDate[];
  officialLink?: string;
  isVerifiedOfficial: boolean;
  tags: string[];
  featured?: boolean;
  applicantCount?: number;
}

export type ApplicationStatus =
  | 'Saved'
  | 'Planning to Apply'
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Approved'
  | 'Rejected';

export interface ApplicationChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Application {
  id: string;
  scholarshipId: string;
  scholarship: Scholarship;
  status: ApplicationStatus;
  appliedDate?: string;
  submissionDeadline: string;
  updatedDate: string;
  notes?: string;
  applicationRefNumber?: string;
  checklist: ApplicationChecklistItem[];
  portalUrl?: string;
}

export interface DocumentItem {
  id: string;
  documentType:
    | 'Aadhaar Card'
    | 'Income Certificate'
    | 'Caste Certificate'
    | 'Domicile Certificate'
    | 'Previous Academic Marksheet'
    | 'Bonafide Certificate'
    | 'Bank Passbook'
    | 'Passport-size Photograph'
    | 'Statement of Purpose / Essay';
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  verified: boolean;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'status_change' | 'profile' | 'document' | 'recommendation';
  timestamp: string;
  read: boolean;
  link?: string;
  scholarshipId?: string;
}

export type EligibilityStatus = 'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'PROFILE_INCOMPLETE';

export interface RuleEvaluation {
  id: string;
  name: string;
  description: string;
  studentValue: string;
  requiredValue: string;
  status: 'satisfied' | 'failed' | 'missing_info';
  isMandatory: boolean;
}

export interface EligibilityReport {
  scholarshipId: string;
  status: EligibilityStatus;
  overallScore: number; // 0 - 100%
  rules: RuleEvaluation[];
  satisfiedCount: number;
  failedCount: number;
  missingCount: number;
  explanation: string;
  actionItems: string[];
  disclaimer: string;
}

export interface MatchScoreBreakdown {
  totalScore: number; // 0 - 100
  educationMatch: number; // max 20
  academicScoreMatch: number; // max 25
  financialNeedMatch: number; // max 25
  categoryGenderMatch: number; // max 15
  stateLocationMatch: number; // max 15
  reasons: string[];
}

export interface ApplicationReadiness {
  scholarshipId: string;
  score: number; // 0 - 100%
  isReadyToApply: boolean;
  profileCompleted: boolean;
  documentsUploadedCount: number;
  totalRequiredDocuments: number;
  missingDocuments: string[];
  checklistItems: {
    label: string;
    completed: boolean;
    type: 'profile' | 'document' | 'eligibility' | 'review';
  }[];
}

export interface FilterState {
  searchQuery: string;
  educationLevel: string;
  category: string;
  providerType: string;
  state: string;
  maxIncome: number;
  minAmount: number;
  gender: string;
  sortBy: 'recommended' | 'deadline_soon' | 'highest_amount' | 'title_asc';
  onlyEligible: boolean;
}

