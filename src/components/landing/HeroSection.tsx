'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Zap, ShieldCheck, ChartNoAxesCombined } from 'lucide-react';

import ScholarshipCards from './ScholarshipCards';
import { createScrambleTween } from '@/lib/animations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const heading = container.current?.querySelector(
        '.scramble-heading'
      ) as HTMLElement | null;

      if (!heading) return;

      const originalText = heading.getAttribute('data-text') || '';

      const leftTrack = container.current?.querySelector(
        '.column-up .marquee-track'
      ) as HTMLElement | null;

      const rightTrack = container.current?.querySelector(
        '.column-down .marquee-track'
      ) as HTMLElement | null;

      const leftColumn = container.current?.querySelector(
        '.column-up'
      ) as HTMLElement | null;

      const rightColumn = container.current?.querySelector(
        '.column-down'
      ) as HTMLElement | null;

      // 1. Initial states setup
      gsap.set('.cards-entrance', {
        x: 160,
        autoAlpha: 0,
      });

      if (leftColumn && rightColumn) {
        gsap.set([leftColumn, rightColumn], {
          autoAlpha: 0,
          y: 35,
        });
      }

      gsap.set('.hero-copy', {
        autoAlpha: 0,
        y: 35,
      });

      gsap.set('.hero-support', {
        autoAlpha: 0,
        y: 20,
      });

      // Right track starts at -50% to travel downward towards 0%
      if (rightTrack) {
        gsap.set(rightTrack, {
          yPercent: -50,
        });
      }
      if (leftTrack) {
        gsap.set(leftTrack, {
          yPercent: 0,
        });
      }

      // 2. Coordinated Entrance Timeline
      const entrance = gsap.timeline();

      // Step 1: Entire tilted scholarship composition enters from right
      entrance.to('.cards-entrance', {
        x: 0,
        autoAlpha: 1,
        duration: 1.3,
        ease: 'power3.out',
      });

      // Step 2: Both columns appear with smooth staggered entrance
      if (leftColumn && rightColumn) {
        entrance.to(
          [leftColumn, rightColumn],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
          },
          '-=0.8'
        );
      }

      // Step 3: Hero content appears & heading scrambles
      entrance.to(
        '.hero-copy',
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.6'
      );

      entrance.add(createScrambleTween(heading, originalText), '-=0.2');

      // Step 4: Description, search form, and feature pills appear
      entrance.to(
        '.hero-support',
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.4'
      );

      // Step 5: Start continuous opposing-direction carousels
      if (!prefersReducedMotion && leftTrack && rightTrack) {
        entrance.add(() => {
          // Left column moves continuously UPWARD
          gsap.fromTo(
            leftTrack,
            { yPercent: 0 },
            {
              yPercent: -50,
              duration: 22,
              ease: 'none',
              repeat: -1,
            }
          );

          // Right column moves continuously DOWNWARD
          gsap.fromTo(
            rightTrack,
            { yPercent: -50 },
            {
              yPercent: 0,
              duration: 26,
              ease: 'none',
              repeat: -1,
            }
          );
        });
      }
    },
    { scope: container }
  );

  return (
    <section ref={container} className="hero-section">
      <div className="hero-container">
        {/* LEFT CONTENT */}
        <div className="hero-copy">
          <div className="hero-label">
            <Zap size={16} />
            All Scholarships in One Place
          </div>

          <h1
            className="scramble-heading"
            data-text="Your Future Deserves Every Opportunity."
          >
            Your Future Deserves Every Opportunity.
          </h1>

          <p className="hero-support hero-description">
            Discover scholarships that match your ambitions. Find the right
            opportunities and take the next step towards your future.
          </p>

          <form
            id="scholarship-search"
            className="hero-support hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(
                  `/scholarships?q=${encodeURIComponent(searchQuery.trim())}`
                );
              } else {
                router.push('/scholarships');
              }
            }}
          >
            <Search size={22} />
            <input
              type="text"
              placeholder="Search scholarships, schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Explore →</button>
          </form>

          <div className="hero-support hero-features">
            <div>
              <Zap />
              <span>
                Personalized
                <br />
                Matches
              </span>
            </div>

            <div>
              <ShieldCheck />
              <span>
                Eligibility
                <br />
                Check
              </span>
            </div>

            <div>
              <ChartNoAxesCombined />
              <span>
                Application
                <br />
                Tracker
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SCHOLARSHIP CARDS (TILTED DUAL VERTICAL MARQUEE) */}
        <div className="hero-visual">
          <ScholarshipCards />
        </div>
      </div>
    </section>
  );
}
