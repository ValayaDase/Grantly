export interface DeadlineInfo {
  daysRemaining: number;
  label: string;
  badgeType: 'critical' | 'warning' | 'normal' | 'expired';
  formattedDeadline: string;
  isClosingSoon: boolean;
  isExpired: boolean;
}

// Stable base date for SSR / static generation in Next.js 16
const STABLE_REFERENCE_DATE = '2026-11-07T00:00:00.000Z';

export function getDeadlineInfo(deadlineIso: string, customDate?: Date | string): DeadlineInfo {
  const targetDate = new Date(deadlineIso);
  
  // Use customDate if provided, or stable reference date to avoid Next.js 16 prerender errors
  const now = customDate ? new Date(customDate) : new Date(STABLE_REFERENCE_DATE);

  // Reset hours to compare calendar days accurately
  targetDate.setHours(23, 59, 59, 999);
  now.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formattedDeadline = new Date(deadlineIso).toLocaleDateString('en-IN', options);

  if (daysRemaining < 0) {
    return {
      daysRemaining,
      label: 'Expired',
      badgeType: 'expired',
      formattedDeadline,
      isClosingSoon: false,
      isExpired: true,
    };
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining: 0,
      label: 'Closes Today',
      badgeType: 'critical',
      formattedDeadline,
      isClosingSoon: true,
      isExpired: false,
    };
  }

  if (daysRemaining === 1) {
    return {
      daysRemaining: 1,
      label: 'Closes Tomorrow',
      badgeType: 'critical',
      formattedDeadline,
      isClosingSoon: true,
      isExpired: false,
    };
  }

  if (daysRemaining <= 7) {
    return {
      daysRemaining,
      label: `${daysRemaining} days left`,
      badgeType: 'critical',
      formattedDeadline,
      isClosingSoon: true,
      isExpired: false,
    };
  }

  if (daysRemaining <= 30) {
    return {
      daysRemaining,
      label: `${daysRemaining} days left`,
      badgeType: 'warning',
      formattedDeadline,
      isClosingSoon: false,
      isExpired: false,
    };
  }

  return {
    daysRemaining,
    label: `${daysRemaining} days left`,
    badgeType: 'normal',
    formattedDeadline,
    isClosingSoon: false,
    isExpired: false,
  };
}
