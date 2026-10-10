'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Booking, BookingStatus } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { MessageSquare, Calendar, Clock, MapPin, Play, CheckCircle2, Phone, Dog } from 'lucide-react';

export default function HelperBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    const res = await api.get<Booking[]>('/bookings');
    if (res.success && res.data) setBookings(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: string, nextStatus: BookingStatus) => {
    setUpdatingId(bookingId);
    const res = await api.patch(`/bookings/${bookingId}/status`, { status: nextStatus });
    setUpdatingId(null);

    if (res.success) {
      setBookings(
        bookings.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b))
      );
    } else {
      alert(res.error || 'Failed to update status');
    }
  };

  const filtered = bookings.filter((b) => {
    if (activeTab === 'ACTIVE') return b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.IN_PROGRESS;
    if (activeTab === 'COMPLETED') return b.status === BookingStatus.COMPLETED;
    return true;
  });

  const tabs = [
    { id: 'ALL', label: 'All Jobs', count: bookings.length },
    { id: 'ACTIVE', label: 'Active Jobs', count: bookings.filter((b) => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.IN_PROGRESS).length },
    { id: 'COMPLETED', label: 'Completed', count: bookings.filter((b) => b.status === BookingStatus.COMPLETED).length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-forest-950 tracking-tight">Active & Completed Jobs</h1>
        <p className="text-xs text-stone-500 mt-0.5">Manage your pet service bookings, mark jobs as started and completed.</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-9 h-9 border-3 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center space-y-3.5 bg-ivory-50/50 border-stone-200">
          <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto shadow-inner">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-forest-950">No jobs in this category</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Jobs you accept will show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Card key={booking.id} className="p-6 space-y-4 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3.5">
                  <img
                    src={booking.owner?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'}
                    alt={booking.owner?.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-forest-500/20 shadow-soft-sm"
                  />
                  <div>
                    <h3 className="text-base font-bold text-forest-950">{booking.owner?.name}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {booking.owner?.phone || 'No phone listed'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={booking.status} />
                  <span className="text-xl font-black text-forest-900">${booking.agreedPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-forest-600" />
                  <span className="font-bold text-forest-950">{booking.request?.pet?.name}</span>
                  <span>({booking.request?.serviceType?.replace('_', ' ')})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest-600" />
                  <span>{new Date(booking.request?.scheduledDate || '').toLocaleDateString()} @ {booking.request?.startTime}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
                  <span className="truncate">{booking.request?.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/chat?bookingId=${booking.id}`}>
                    <Button variant="outline" size="sm" className="text-xs text-stone-700 hover:bg-stone-50 border-stone-200">
                      <MessageSquare className="w-3.5 h-3.5" /> Message Pet Owner
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  {booking.status === BookingStatus.CONFIRMED && (
                    <Button
                      size="sm"
                      isLoading={updatingId === booking.id}
                      onClick={() => handleUpdateStatus(booking.id, BookingStatus.IN_PROGRESS)}
                      className="bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-bold shadow-soft-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Start Service
                    </Button>
                  )}

                  {booking.status === BookingStatus.IN_PROGRESS && (
                    <Button
                      size="sm"
                      variant="forest"
                      isLoading={updatingId === booking.id}
                      onClick={() => handleUpdateStatus(booking.id, BookingStatus.COMPLETED)}
                      className="text-xs shadow-soft-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Service Completed
                    </Button>
                  )}

                  {booking.status === BookingStatus.COMPLETED && (
                    <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-200">
                      ✓ Job Completed & Paid
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
