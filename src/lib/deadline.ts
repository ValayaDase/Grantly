export interface DeadlineInfo {
  daysRemaining: number;
  label: string;
  badgeType: 'critical' | 'warning' | 'normal' | 'expired';
  formattedDeadline: string;
  isClosingSoon: boolean;
  isExpired: boolean;
}

function utcDay(value: Date | string): Date | null {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(valueByType.year), Number(valueByType.month) - 1, Number(valueByType.day)));
}

export const DEFAULT_REFERENCE_DATE = '2026-11-07';

export function getDeadlineInfo(deadlineIso: string, customDate: Date | string = DEFAULT_REFERENCE_DATE): DeadlineInfo {
  const targetDate = utcDay(deadlineIso);
  const today = utcDay(customDate);
  if (!targetDate || !today) {
    return {
      daysRemaining: 0,
      label: 'Date unavailable',
      badgeType: 'normal',
      formattedDeadline: 'Date unavailable',
      isClosingSoon: false,
      isExpired: false,
    };
  }

  const formattedDeadline = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(targetDate);
  const daysRemaining = Math.round((targetDate.getTime() - today.getTime()) / 86_400_000);

  if (daysRemaining < 0) {
    return { daysRemaining, label: 'Expired', badgeType: 'expired', formattedDeadline, isClosingSoon: false, isExpired: true };
  }
  if (daysRemaining === 0) {
    return { daysRemaining, label: 'Closes Today', badgeType: 'critical', formattedDeadline, isClosingSoon: true, isExpired: false };
  }
  if (daysRemaining === 1) {
    return { daysRemaining, label: 'Closes Tomorrow', badgeType: 'critical', formattedDeadline, isClosingSoon: true, isExpired: false };
  }
  if (daysRemaining <= 7) {
    return { daysRemaining, label: `${daysRemaining} days left`, badgeType: 'critical', formattedDeadline, isClosingSoon: true, isExpired: false };
  }
  if (daysRemaining <= 30) {
    return { daysRemaining, label: `${daysRemaining} days left`, badgeType: 'warning', formattedDeadline, isClosingSoon: false, isExpired: false };
  }
  return { daysRemaining, label: `${daysRemaining} days left`, badgeType: 'normal', formattedDeadline, isClosingSoon: false, isExpired: false };
}
