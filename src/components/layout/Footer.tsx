'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Sparkles, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#171B2D] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#5B4BDB] flex items-center justify-center text-white font-bold text-lg">
                G
              </div>
              <span className="text-xl font-bold tracking-tight text-white">GRANTLY</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering Indian school, undergraduate, postgraduate and research students with unified scholarship discovery, smart rule-based eligibility evaluation, and deadline management.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 rounded-xl px-3 py-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built for Indian Students • 100% Free Open Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Discovery</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/scholarships" className="hover:text-white transition-colors">
                  All Scholarships
                </Link>
              </li>
              <li>
                <Link href="/scholarships?category=STEM+%26+Tech" className="hover:text-white transition-colors">
                  STEM & Tech Schemes
                </Link>
              </li>
              <li>
                <Link href="/scholarships?category=Women+Empowerment" className="hover:text-white transition-colors">
                  Girls & Women Fellowships
                </Link>
              </li>
              <li>
                <Link href="/scholarships?providerType=Government" className="hover:text-white transition-colors">
                  Government Schemes (NSP)
                </Link>
              </li>
              <li>
                <Link href="/scholarships?providerType=Corporate+CSR" className="hover:text-white transition-colors">
                  Corporate CSR Grants
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Student Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/eligibility" className="hover:text-white transition-colors">
                  Smart Eligibility Checker
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-white transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-white transition-colors">
                  Document Vault
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  Saved Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Official Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Official Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  National Scholarship Portal (NSP)
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://aicte-india.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  AICTE Schemes
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://online-inspire.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  DST INSPIRE She
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarship.up.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  UP SAKSHAM Portal
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <p>
              <strong className="text-slate-300">Demo Prototype Notice:</strong> Demonstrative records are sample educational data. All external submissions must be completed on official portals.
            </p>
          </div>
          <p className="flex items-center gap-1 shrink-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Student Success • © 2026 GRANTLY
          </p>
        </div>
      </div>
    </footer>
  );
}
