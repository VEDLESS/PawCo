'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { Avatar } from '../ui/Avatar';
import { Bell, Heart, LogOut, Menu, PawPrint, User as UserIcon, X, PlusCircle, Compass, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCustomer = user && (user.role === 'OWNER' || user.role === 'CUSTOMER');
  const isHelper = user && user.role === 'HELPER';
  const isAdmin = user && user.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/70 shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-900/15 group-hover:scale-105 transition-transform">
            <PawPrint className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
              Pet<span className="text-teal-700">Co</span>
            </span>
            <span className="text-[9px] block -mt-1 font-extrabold text-stone-400 uppercase tracking-widest">
              Neighborhood Pet Care
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          <Link href="/" className="hover:text-teal-700 transition-colors">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-teal-700 transition-colors">
                Dashboard
              </Link>
              {isCustomer && (
                <>
                  <Link
                    href="/dashboard/owner/requests/new"
                    className="text-teal-700 hover:text-teal-800 transition-colors flex items-center gap-1 font-extrabold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Request Care
                  </Link>
                  <Link href="/dashboard/owner/pets" className="hover:text-teal-700 transition-colors">
                    My Pets
                  </Link>
                  <Link href="/dashboard/owner/requests" className="hover:text-teal-700 transition-colors">
                    My Requests
                  </Link>
                  <Link href="/dashboard/owner/helpers" className="hover:text-teal-700 transition-colors">
                    Find Helpers
                  </Link>
                </>
              )}
              {isHelper && (
                <>
                  <Link href="/dashboard/helper/jobs" className="hover:text-teal-700 transition-colors">
                    Nearby Jobs
                  </Link>
                  <Link href="/dashboard/helper/bookings" className="hover:text-teal-700 transition-colors">
                    Bookings
                  </Link>
                  <Link href="/dashboard/helper/profile" className="hover:text-teal-700 transition-colors">
                    Rate Card
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="text-rose-700 hover:text-rose-800 transition-colors flex items-center gap-1 font-extrabold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              )}
            </>
          ) : (
            <>
              <a href="#services" className="hover:text-teal-700 transition-colors">
                Services
              </a>
              <a href="#how-it-works" className="hover:text-teal-700 transition-colors">
                How It Works
              </a>
              <a href="#helpers" className="hover:text-teal-700 transition-colors">
                Verified Helpers
              </a>
            </>
          )}
        </nav>

        {/* User / Notification Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Popover Trigger */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-stone-100 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-xl border border-stone-200/80 p-4 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllAsRead()}
                          className="text-xs font-bold text-teal-700 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-50 py-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-6">No new notifications</p>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3 rounded-xl transition-colors cursor-pointer text-xs space-y-1 ${
                              !n.read ? 'bg-teal-50/50' : 'hover:bg-stone-50'
                            }`}
                          >
                            <p className="font-bold text-slate-900">{n.title}</p>
                            <p className="text-stone-600 text-[11px] leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-stone-400 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200/80">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Avatar
                    src={user.profileImage || undefined}
                    fallback={user.name?.charAt(0) || 'U'}
                    className="w-8 h-8 rounded-xl ring-2 ring-teal-600/20"
                  />
                  <div className="hidden lg:block text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">{user.name}</span>
                    <span className="text-[10px] text-teal-700 font-extrabold capitalize block">
                      {isCustomer ? 'Customer' : user.role.toLowerCase()}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors ml-1"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-stone-100 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-sm shadow-teal-900/15 transition-all active:scale-[0.98]">
                  Join PetCo
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-stone-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-white border-b border-stone-200/80 space-y-2 animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-stone-50 rounded-xl"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-stone-50 rounded-xl"
              >
                Dashboard
              </Link>
              {isCustomer && (
                <>
                  <Link
                    href="/dashboard/owner/requests/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-bold text-teal-700 bg-teal-50 rounded-xl"
                  >
                    🐾 Request Pet Care
                  </Link>
                  <Link
                    href="/dashboard/owner/pets"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-stone-50 rounded-xl"
                  >
                    My Pets
                  </Link>
                  <Link
                    href="/dashboard/owner/requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-stone-50 rounded-xl"
                  >
                    Active Requests & Offers
                  </Link>
                </>
              )}
              {isHelper && (
                <Link
                  href="/dashboard/helper/jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-bold text-teal-700 bg-teal-50 rounded-xl"
                >
                  Nearby Pet Jobs
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 rounded-xl"
                >
                  Admin Portal
                </Link>
              )}
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-2 text-xs font-bold text-slate-700 bg-stone-100 rounded-xl">
                  Sign In
                </button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-2 text-xs font-bold text-white bg-teal-700 rounded-xl">
                  Join PetCo
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
