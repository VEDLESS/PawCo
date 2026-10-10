'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, ServiceRequest } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Briefcase,
  DollarSign,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export default function HelperOverviewPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [nearbyRequests, setNearbyRequests] = useState<ServiceRequest[]>([]);
  const [isAvailable, setIsAvailable] = useState(user?.helperProfile?.isAvailable ?? true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const [bookRes, reqRes] = await Promise.all([
      api.get<Booking[]>('/bookings'),
      api.get<ServiceRequest[]>('/requests/nearby'),
    ]);

    if (bookRes.success && bookRes.data) setBookings(bookRes.data);
    if (reqRes.success && reqRes.data) setNearbyRequests(reqRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    await api.put('/helpers/profile', { isAvailable: nextVal });
  };

  const completed = bookings.filter((b) => b.status === 'COMPLETED');
  const active = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
  const totalEarnings = completed.reduce((sum, b) => sum + b.agreedPrice, 0);

  return (
    <div className="space-y-8">
      {/* Helper Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-br from-forest-900 via-forest-950 to-stone-950 rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl border border-forest-800/40">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-700/60 rounded-full text-xs font-bold text-forest-200 border border-forest-600/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Verified Care Partner
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-xs sm:text-sm text-stone-300">
            {active.length} active booking{active.length === 1 ? '' : 's'} • {nearbyRequests.length} nearby job{nearbyRequests.length === 1 ? '' : 's'} available
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner">
          <span className="text-xs font-bold">{isAvailable ? '🟢 Accepting Jobs' : '⏸️ On Break'}</span>
          <button
            onClick={handleToggleAvailability}
            className="text-forest-300 hover:text-white transition-colors"
          >
            {isAvailable ? <ToggleRight className="w-8 h-8 fill-forest-400" /> : <ToggleLeft className="w-8 h-8 text-stone-400" />}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center justify-between border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-2xl font-black text-forest-950 mt-1">${totalEarnings.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Active Bookings</p>
            <h3 className="text-2xl font-black text-forest-950 mt-1">{active.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-inner">
            <Calendar className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Jobs Completed</p>
            <h3 className="text-2xl font-black text-forest-950 mt-1">{completed.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Rating</p>
            <h3 className="text-2xl font-black text-forest-950 mt-1">
              {user?.helperProfile?.rating?.toFixed(1) || '5.0'} ★
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
        </Card>
      </div>

      {/* Active Jobs in Progress */}
      {active.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-forest-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest-500 animate-pulse" /> Active Bookings
            </h3>
            <Link href="/dashboard/helper/bookings" className="text-xs font-bold text-forest-700 hover:underline">
              Manage all jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((b) => (
              <Card key={b.id} className="p-5 border-stone-200 bg-white space-y-4 shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.owner?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'}
                      alt={b.owner?.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-forest-500/20 shadow-soft-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-forest-950">{b.owner?.name}</h4>
                      <p className="text-xs text-stone-500">{b.request?.location}</p>
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-100 text-xs space-y-1">
                  <p className="font-bold text-forest-950">
                    {b.request?.serviceType?.replace('_', ' ')} for {b.request?.pet?.name}
                  </p>
                  <p className="text-stone-500">
                    {new Date(b.request?.scheduledDate || '').toLocaleDateString()} @ {b.request?.startTime}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-black text-forest-900">${b.agreedPrice.toFixed(2)}</span>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/chat?bookingId=${b.id}`}>
                      <Button size="sm" variant="outline" className="text-xs text-stone-700 hover:bg-stone-50 border-stone-200">
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                      </Button>
                    </Link>
                    <Link href="/dashboard/helper/bookings">
                      <Button size="sm" variant="forest" className="text-xs shadow-soft-sm">
                        Manage Job
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Jobs Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-forest-950">Nearby Requests ({nearbyRequests.length})</h3>
          <Link href="/dashboard/helper/jobs" className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1">
            View all jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {nearbyRequests.length === 0 ? (
          <Card className="p-10 text-center space-y-3 bg-ivory-50/50 border-stone-200">
            <Briefcase className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-xs text-stone-500 max-w-sm mx-auto">No open pet care requests nearby right now. We will notify you when new requests are posted!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nearbyRequests.slice(0, 3).map((req) => (
              <Card key={req.id} hoverable className="p-4 space-y-3 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="flex items-center gap-3">
                  <img
                    src={req.pet?.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop'}
                    alt={req.pet?.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-forest-500/20 shadow-soft-sm"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-forest-950 line-clamp-1">{req.title}</h4>
                    <p className="text-[11px] text-forest-700 font-semibold">{req.pet?.name} • {req.serviceType.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 space-y-1 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
                  <p>📅 {new Date(req.scheduledDate).toLocaleDateString()} @ {req.startTime}</p>
                  <p className="truncate">📍 {req.location}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-black text-forest-900">${req.budget.toFixed(2)}</span>
                  <Link href="/dashboard/helper/jobs">
                    <Button size="sm" variant="forest" className="text-xs shadow-soft-sm">
                      View Job
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
