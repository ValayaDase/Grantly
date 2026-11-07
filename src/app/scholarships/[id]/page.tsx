import { SCHOLARSHIPS_DATA } from '@/data/scholarships';
import { ScholarshipDetailClient } from './ScholarshipDetailClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return SCHOLARSHIPS_DATA.map((s) => ({
    id: s.id,
  }));
}

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === id);

  if (!scholarship) {
    notFound();
  }

  return <ScholarshipDetailClient scholarshipId={id} />;
}
