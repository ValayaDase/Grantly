'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ScholarshipCard from './ScholarshipCard';
import {
  Landmark,
  Award,
  Users,
  Building2,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';

export default function ScholarshipCards() {
  const router = useRouter();

  const handleCardClick = (category: string) => {
    if (category === 'Government Scholarships') {
      router.push('/scholarships?provider=Government');
    } else if (category === 'Private Scholarships') {
      router.push('/scholarships?provider=Corporate+CSR');
    } else if (category === 'Merit-Based Scholarships') {
      router.push('/scholarships?category=Merit-Based');
    } else if (category === 'Need-Based Scholarships') {
      router.push('/scholarships?category=Need-Based');
    } else if (category === 'Women Scholarships') {
      router.push('/scholarships?gender=female');
    } else if (category === 'Minority Scholarships') {
      router.push('/scholarships?category=Minority+Welfare');
    } else {
      router.push('/scholarships');
    }
  };

  return (
    <div className="cards-entrance">
      {/* 1. ENTIRE COMMON CONTAINER TILTED AT -8deg */}
      <div className="scholarship-tilt">
        {/* 2. PROPER TWO-COLUMN STACKING */}
        <div className="scholarship-stage">
          {/* LEFT COLUMN: UPWARD CONTINUOUS MARQUEE */}
          <div className="scholarship-column column-up">
            <div className="marquee-track">
              {/* Primary Group */}
              <div className="marquee-group">
                <ScholarshipCard
                  title="Government Scholarships"
                  icon={Landmark}
                  color="icon-blue"
                  onClick={() => handleCardClick('Government Scholarships')}
                />
                <ScholarshipCard
                  title="Merit-Based Scholarships"
                  icon={Award}
                  color="icon-purple"
                  onClick={() => handleCardClick('Merit-Based Scholarships')}
                />
                <ScholarshipCard
                  title="Minority Scholarships"
                  icon={Users}
                  color="icon-orange"
                  onClick={() => handleCardClick('Minority Scholarships')}
                />
              </div>

              {/* Duplicate Group for Seamless Infinite Loop */}
              <div className="marquee-group" aria-hidden="true">
                <ScholarshipCard
                  title="Government Scholarships"
                  icon={Landmark}
                  color="icon-blue"
                  onClick={() => handleCardClick('Government Scholarships')}
                />
                <ScholarshipCard
                  title="Merit-Based Scholarships"
                  icon={Award}
                  color="icon-purple"
                  onClick={() => handleCardClick('Merit-Based Scholarships')}
                />
                <ScholarshipCard
                  title="Minority Scholarships"
                  icon={Users}
                  color="icon-orange"
                  onClick={() => handleCardClick('Minority Scholarships')}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DOWNWARD CONTINUOUS MARQUEE */}
          <div className="scholarship-column column-down">
            <div className="marquee-track">
              {/* Primary Group */}
              <div className="marquee-group">
                <ScholarshipCard
                  title="Private Scholarships"
                  icon={Building2}
                  color="icon-green"
                  onClick={() => handleCardClick('Private Scholarships')}
                />
                <ScholarshipCard
                  title="Need-Based Scholarships"
                  icon={HeartHandshake}
                  color="icon-orange"
                  onClick={() => handleCardClick('Need-Based Scholarships')}
                />
                <ScholarshipCard
                  title="Women Scholarships"
                  icon={Sparkles}
                  color="icon-pink"
                  onClick={() => handleCardClick('Women Scholarships')}
                />
              </div>

              {/* Duplicate Group for Seamless Infinite Loop */}
              <div className="marquee-group" aria-hidden="true">
                <ScholarshipCard
                  title="Private Scholarships"
                  icon={Building2}
                  color="icon-green"
                  onClick={() => handleCardClick('Private Scholarships')}
                />
                <ScholarshipCard
                  title="Need-Based Scholarships"
                  icon={HeartHandshake}
                  color="icon-orange"
                  onClick={() => handleCardClick('Need-Based Scholarships')}
                />
                <ScholarshipCard
                  title="Women Scholarships"
                  icon={Sparkles}
                  color="icon-pink"
                  onClick={() => handleCardClick('Women Scholarships')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
