import React from 'react';
import Link from 'next/link';
import { PawPrint, Shield, Heart, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
                <PawPrint className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight">PawCo</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The premier hyperlocal pet-care marketplace connecting loving pet owners with verified neighborhood helpers.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard/owner/requests/new" className="hover:text-teal-400 transition-colors">Dog Walking</Link></li>
              <li><Link href="/dashboard/owner/requests/new" className="hover:text-teal-400 transition-colors">Pet Sitting</Link></li>
              <li><Link href="/dashboard/owner/requests/new" className="hover:text-teal-400 transition-colors">Feeding & Care</Link></li>
              <li><Link href="/dashboard/owner/requests/new" className="hover:text-teal-400 transition-colors">Medication Assistance</Link></li>
              <li><Link href="/dashboard/owner/requests/new" className="hover:text-teal-400 transition-colors">Home Boarding</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-teal-400 transition-colors">Owner Sign In</Link></li>
              <li><Link href="/register?role=HELPER" className="hover:text-teal-400 transition-colors">Become a Pet Helper</Link></li>
              <li><Link href="/dashboard" className="hover:text-teal-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/owner/helpers" className="hover:text-teal-400 transition-colors">Safety & Verification</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Trust & Safety</h4>
            <p className="text-slate-400 text-xs mb-3 leading-relaxed">
              Every PawCo helper is identity-verified with background checks and community reviews.
            </p>
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs">
              <Shield className="w-4 h-4" /> 100% Insured & Verified
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PawCo Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
