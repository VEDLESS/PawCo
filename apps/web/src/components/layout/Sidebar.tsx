'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Dog,
  PlusCircle,
  CalendarCheck,
  MessageSquare,
  Users,
  Compass,
  Briefcase,
  UserCheck,
  ShieldCheck,
  ListTodo,
  ShieldAlert,
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const isCustomer = user.role === 'OWNER' || user.role === 'CUSTOMER';
  const isHelper = user.role === 'HELPER';
  const isAdmin = user.role === 'ADMIN';

  const customerLinks = [
    { href: '/dashboard/owner', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/owner/pets', label: 'My Pets', icon: Dog },
    { href: '/dashboard/owner/requests/new', label: 'Request Care', icon: PlusCircle },
    { href: '/dashboard/owner/requests', label: 'Requests & Offers', icon: ListTodo },
    { href: '/dashboard/owner/bookings', label: 'My Bookings', icon: CalendarCheck },
    { href: '/dashboard/owner/helpers', label: 'Find Helpers', icon: Compass },
    { href: '/dashboard/chat', label: 'Messages', icon: MessageSquare },
  ];

  const helperLinks = [
    { href: '/dashboard/helper', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/helper/jobs', label: 'Nearby Jobs', icon: Briefcase },
    { href: '/dashboard/helper/bookings', label: 'Active Bookings', icon: CalendarCheck },
    { href: '/dashboard/helper/profile', label: 'Rate Card & Profile', icon: UserCheck },
    { href: '/dashboard/chat', label: 'Messages', icon: MessageSquare },
  ];

  const adminLinks = [
    { href: '/dashboard/admin', label: 'Admin Portal', icon: ShieldCheck },
    { href: '/dashboard/admin?tab=EMERGENCY', label: '🚨 Emergency Monitor', icon: ShieldAlert },
    { href: '/dashboard/admin?tab=users', label: 'Users & Helpers', icon: Users },
    { href: '/dashboard/admin?tab=requests', label: 'All Requests', icon: ListTodo },
    { href: '/dashboard/admin?tab=bookings', label: 'All Bookings', icon: CalendarCheck },
  ];

  let links = customerLinks;
  if (isHelper) links = helperLinks;
  if (isAdmin) links = adminLinks;

  const roleBadgeLabel = isCustomer ? 'CUSTOMER' : user.role;

  return (
    <aside className="w-64 bg-white border-r border-stone-200/70 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        {/* Role Pill Card */}
        <div className="px-3.5 py-2.5 bg-[#fbfaf8] rounded-2xl border border-stone-200/80 shadow-soft-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">Workspace</p>
          <div className="flex items-center justify-between mt-1">
            <span
              className={clsx(
                'text-[11px] font-black px-2 py-0.5 rounded-md border tracking-tight',
                isAdmin
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : isHelper
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              )}
            >
              {roleBadgeLabel} PORTAL
            </span>
            <span className="text-[10px] text-stone-400 truncate max-w-[90px]">{user.location || 'Local'}</span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/15'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-slate-900'
                )}
              >
                <Icon className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-stone-400')} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* PawCo Trust Banner */}
      <div className="p-3.5 bg-gradient-to-tr from-teal-50/70 to-emerald-50/70 rounded-2xl border border-teal-100/80">
        <p className="text-xs font-extrabold text-teal-950">PawCo Care Guarantee</p>
        <p className="text-[11px] text-teal-800 mt-1 leading-relaxed">
          Every booking includes community verification, direct messaging, and 24/7 emergency dispatch support.
        </p>
      </div>
    </aside>
  );
};
