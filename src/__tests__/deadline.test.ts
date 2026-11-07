import { describe, it, expect } from 'vitest';
import { getDeadlineInfo } from '@/lib/deadline';

describe('getDeadlineInfo', () => {
  const referenceDate = new Date('2026-11-07T00:00:00Z');

  it('marks past deadlines as expired', () => {
    const info = getDeadlineInfo('2026-10-15', referenceDate);
    expect(info.isExpired).toBe(true);
    expect(info.badgeType).toBe('expired');
    expect(info.label).toBe('Expired');
    expect(info.daysRemaining).toBeLessThan(0);
  });

  it('handles closing today correctly', () => {
    const info = getDeadlineInfo('2026-11-07', referenceDate);
    expect(info.isExpired).toBe(false);
    expect(info.isClosingSoon).toBe(true);
    expect(info.badgeType).toBe('critical');
    expect(info.label).toBe('Closes Today');
    expect(info.daysRemaining).toBe(0);
  });

  it('handles closing tomorrow correctly', () => {
    const info = getDeadlineInfo('2026-11-08', referenceDate);
    expect(info.isClosingSoon).toBe(true);
    expect(info.badgeType).toBe('critical');
    expect(info.label).toBe('Closes Tomorrow');
    expect(info.daysRemaining).toBe(1);
  });

  it('classifies under 7 days as critical closing soon', () => {
    const info = getDeadlineInfo('2026-11-12', referenceDate);
    expect(info.isClosingSoon).toBe(true);
    expect(info.badgeType).toBe('critical');
    expect(info.daysRemaining).toBe(5);
  });

  it('classifies 8-30 days as warning badge', () => {
    const info = getDeadlineInfo('2026-11-25', referenceDate);
    expect(info.isClosingSoon).toBe(false);
    expect(info.badgeType).toBe('warning');
    expect(info.daysRemaining).toBe(18);
  });

  it('handles invalid dates safely without crashing', () => {
    const info = getDeadlineInfo('not-a-valid-date', referenceDate);
    expect(info.label).toBe('Date unavailable');
    expect(info.formattedDeadline).toBe('Date unavailable');
  });
});

