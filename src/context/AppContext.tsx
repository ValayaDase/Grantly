'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  Application,
  DocumentItem,
  FilterState,
  NotificationItem,
  Scholarship,
  StudentProfile,
} from '@/types';
import { SCHOLARSHIPS_DATA } from '@/data/scholarships';
import {
  DEMO_STUDENT_PROFILE,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SAVED_IDS,
} from '@/data/mockStudent';
import { getDeadlineInfo } from '@/lib/deadline';

const STORAGE_KEY_PREFIX = 'grantly_v1_';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  educationLevel: 'All',
  category: 'All',
  providerType: 'All',
  state: 'All India',
  maxIncome: 1500000,
  minAmount: 0,
  gender: 'All',
  sortBy: 'recommended',
  onlyEligible: false,
};

interface AppContextType {
  profile: StudentProfile | null;
  isLoggedIn: boolean;
  savedScholarshipIds: string[];
  applications: Application[];
  documents: DocumentItem[];
  notifications: NotificationItem[];
  comparisonIds: string[];
  filters: FilterState;
  allScholarships: Scholarship[];

  // Actions
  saveProfile: (updates: Partial<StudentProfile>) => void;
  toggleSaveScholarship: (id: string) => void;
  isScholarshipSaved: (id: string) => boolean;
  addOrUpdateApplication: (appData: {
    scholarshipId: string;
    status?: Application['status'];
    notes?: string;
    applicationRefNumber?: string;
  }) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  deleteApplication: (applicationId: string) => void;
  toggleComparison: (scholarshipId: string) => void;
  clearComparison: () => void;
  isCompared: (scholarshipId: string) => boolean;
  uploadDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (documentId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  login: (customProfile?: StudentProfile) => void;
  logout: () => void;
  resetToDemoData: () => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;

  // Dynamic Metrics
  stats: {
    profileCompletion: number;
    savedCount: number;
    applicationsCount: number;
    submittedCount: number;
    approvedCount: number;
    underReviewCount: number;
    upcomingDeadlinesCount: number;
    unreadNotificationsCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializers avoiding cascading render effects
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
        return stored ? JSON.parse(stored) : DEMO_STUDENT_PROFILE;
      } catch {
        return DEMO_STUDENT_PROFILE;
      }
    }
    return DEMO_STUDENT_PROFILE;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`);
        return stored !== null ? stored === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}saved`);
        return stored ? JSON.parse(stored) : INITIAL_SAVED_IDS;
      } catch {
        return INITIAL_SAVED_IDS;
      }
    }
    return INITIAL_SAVED_IDS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}apps`);
        return stored ? JSON.parse(stored) : INITIAL_APPLICATIONS;
      } catch {
        return INITIAL_APPLICATIONS;
      }
    }
    return INITIAL_APPLICATIONS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}docs`);
        return stored ? JSON.parse(stored) : INITIAL_DOCUMENTS;
      } catch {
        return INITIAL_DOCUMENTS;
      }
    }
    return INITIAL_DOCUMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifs`);
        return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Sync state changes to LocalStorage
  useEffect(() => {
    try {
      if (profile) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(profile));
      } else {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}profile`);
      }
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, String(isLoggedIn));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}saved`, JSON.stringify(savedScholarshipIds));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}apps`, JSON.stringify(applications));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}docs`, JSON.stringify(documents));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notifs`, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to sync to LocalStorage', e);
    }
  }, [profile, isLoggedIn, savedScholarshipIds, applications, documents, notifications]);

  // Notifications
  const addNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${randomSuffix}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  // Profile Save
  const saveProfile = useCallback((updates: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const updated: StudentProfile = {
        ...(prev || DEMO_STUDENT_PROFILE),
        ...updates,
        onboardingCompleted: true,
        updatedAt: '2026-11-07T12:00:00Z',
      };
      return updated;
    });

    addNotification({
      title: 'Profile Updated Successfully',
      message: 'Your education and financial details have been updated. Your match scores have recalculated.',
      type: 'profile',
      link: '/profile',
    });
  }, [addNotification]);

  // Toggle Save
  const toggleSaveScholarship = useCallback((id: string) => {
    setSavedScholarshipIds((prev) => {
      const exists = prev.includes(id);
      const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === id);
      if (exists) {
        return prev.filter((item) => item !== id);
      } else {
        if (scholarship) {
          addNotification({
            title: 'Scholarship Bookmarked',
            message: `"${scholarship.title}" added to your Saved Scholarships.`,
            type: 'status_change',
            link: '/saved',
            scholarshipId: id,
          });
        }
        return [...prev, id];
      }
    });
  }, [addNotification]);

  const isScholarshipSaved = useCallback(
    (id: string) => savedScholarshipIds.includes(id),
    [savedScholarshipIds]
  );

  // Applications
  const addOrUpdateApplication = useCallback((appData: {
    scholarshipId: string;
    status?: Application['status'];
    notes?: string;
    applicationRefNumber?: string;
  }) => {
    const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === appData.scholarshipId);
    if (!scholarship) return;

    setApplications((prev) => {
      const existingIndex = prev.findIndex((a) => a.scholarshipId === appData.scholarshipId);
      const newStatus = appData.status || 'Planning to Apply';

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status: newStatus,
          notes: appData.notes ?? updated[existingIndex].notes,
          applicationRefNumber: appData.applicationRefNumber ?? updated[existingIndex].applicationRefNumber,
          appliedDate:
            newStatus === 'Applied' && !updated[existingIndex].appliedDate
              ? '2026-11-07'
              : updated[existingIndex].appliedDate,
          updatedDate: '2026-11-07',
        };
        return updated;
      } else {
        const randomId = Math.random().toString(36).substring(2, 7);
        const newApp: Application = {
          id: `app-${randomId}`,
          scholarshipId: scholarship.id,
          scholarship,
          status: newStatus,
          appliedDate: newStatus === 'Applied' ? '2026-11-07' : undefined,
          submissionDeadline: scholarship.deadline,
          updatedDate: '2026-11-07',
          notes: appData.notes || 'Added to your application pipeline.',
          applicationRefNumber: appData.applicationRefNumber,
          portalUrl: scholarship.officialLink,
          checklist: [
            { id: '1', label: 'Eligibility requirements confirmed', completed: true },
            { id: '2', label: 'Documents gathered from vault', completed: false },
            { id: '3', label: 'Submit form on official portal', completed: newStatus === 'Applied' },
            { id: '4', label: 'Nodal verification & tracking', completed: false },
          ],
        };
        return [newApp, ...prev];
      }
    });

    addNotification({
      title: 'Application Pipeline Updated',
      message: `"${scholarship.title}" is now marked as "${appData.status || 'Planning to Apply'}".`,
      type: 'status_change',
      link: '/applications',
      scholarshipId: scholarship.id,
    });
  }, [addNotification]);

  const updateApplicationStatus = useCallback((applicationId: string, status: Application['status']) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) {
          return {
            ...app,
            status,
            appliedDate: status === 'Applied' && !app.appliedDate ? '2026-11-07' : app.appliedDate,
            updatedDate: '2026-11-07',
          };
        }
        return app;
      })
    );

    const app = applications.find((a) => a.id === applicationId);
    if (app) {
      addNotification({
        title: 'Status Updated',
        message: `${app.scholarship.title} marked as "${status}".`,
        type: 'status_change',
        link: '/applications',
        scholarshipId: app.scholarshipId,
      });
    }
  }, [applications, addNotification]);

  const deleteApplication = useCallback((applicationId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
  }, []);

  // Comparisons (Max 3)
  const toggleComparison = useCallback((scholarshipId: string) => {
    setComparisonIds((prev) => {
      if (prev.includes(scholarshipId)) {
        return prev.filter((id) => id !== scholarshipId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), scholarshipId];
      }
      return [...prev, scholarshipId];
    });
  }, []);

  const clearComparison = useCallback(() => setComparisonIds([]), []);
  const isCompared = useCallback((scholarshipId: string) => comparisonIds.includes(scholarshipId), [comparisonIds]);

  // Documents
  const uploadDocument = useCallback((docData: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${randomSuffix}`,
      uploadedAt: '2026-11-07T12:00:00Z',
      verified: true,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    addNotification({
      title: 'Document Added to Vault',
      message: `${newDoc.fileName} (${newDoc.documentType}) successfully recorded.`,
      type: 'document',
      link: '/documents',
    });
  }, [addNotification]);

  const deleteDocument = useCallback((documentId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Auth / Session
  const login = useCallback((customProfile?: StudentProfile) => {
    setIsLoggedIn(true);
    if (customProfile) {
      setProfile(customProfile);
    } else if (!profile) {
      setProfile(DEMO_STUDENT_PROFILE);
    }
  }, [profile]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  // Reset to Demo Data
  const resetToDemoData = useCallback(() => {
    setProfile(DEMO_STUDENT_PROFILE);
    setIsLoggedIn(true);
    setSavedScholarshipIds(INITIAL_SAVED_IDS);
    setApplications(INITIAL_APPLICATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setComparisonIds([]);
    setFilters(DEFAULT_FILTERS);

    localStorage.clear();
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(DEMO_STUDENT_PROFILE));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, 'true');
    localStorage.setItem(`${STORAGE_KEY_PREFIX}saved`, JSON.stringify(INITIAL_SAVED_IDS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}apps`, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}docs`, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifs`, JSON.stringify(INITIAL_NOTIFICATIONS));
  }, []);

  // Filter updates
  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // Dynamic Metrics Calculation
  const stats = useMemo(() => {
    // Profile completeness calculation
    let completionScore = 0;
    if (profile) {
      if (profile.fullName) completionScore += 10;
      if (profile.email) completionScore += 10;
      if (profile.state && profile.city) completionScore += 15;
      if (profile.educationLevel && profile.courseStream) completionScore += 20;
      if (profile.institutionName) completionScore += 10;
      if (profile.percentageOrCgpa && profile.percentageOrCgpa > 0) completionScore += 15;
      if (profile.annualFamilyIncome !== undefined) completionScore += 10;
      if (profile.preferredScholarshipCategories?.length > 0) completionScore += 10;
    }

    // Applications counts
    const savedCount = savedScholarshipIds.length;
    const applicationsCount = applications.length;
    const submittedCount = applications.filter((a) => a.status === 'Applied').length;
    const approvedCount = applications.filter((a) => a.status === 'Approved').length;
    const underReviewCount = applications.filter(
      (a) => a.status === 'Under Review' || a.status === 'Shortlisted'
    ).length;

    // Upcoming deadlines calculation (closing within 30 days)
    const upcomingDeadlinesCount = SCHOLARSHIPS_DATA.filter((s) => {
      const d = getDeadlineInfo(s.deadline);
      return !d.isExpired && d.daysRemaining <= 30;
    }).length;

    const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

    return {
      profileCompletion: Math.min(100, completionScore),
      savedCount,
      applicationsCount,
      submittedCount,
      approvedCount,
      underReviewCount,
      upcomingDeadlinesCount,
      unreadNotificationsCount,
    };
  }, [profile, savedScholarshipIds, applications, notifications]);

  return (
    <AppContext.Provider
      value={{
        profile,
        isLoggedIn,
        savedScholarshipIds,
        applications,
        documents,
        notifications,
        comparisonIds,
        filters,
        allScholarships: SCHOLARSHIPS_DATA,
        saveProfile,
        toggleSaveScholarship,
        isScholarshipSaved,
        addOrUpdateApplication,
        updateApplicationStatus,
        deleteApplication,
        toggleComparison,
        clearComparison,
        isCompared,
        uploadDocument,
        deleteDocument,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        login,
        logout,
        resetToDemoData,
        setFilters,
        updateFilter,
        resetFilters,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
