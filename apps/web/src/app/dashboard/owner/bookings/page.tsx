'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Booking, BookingStatus } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { ReviewModal } from '@/components/modals/ReviewModal';
import { MessageSquare, Calendar, Clock, MapPin, Star, CheckCircle, Dog } from 'lucide-react';

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedReviewBooking, setSelectedReviewBooking] = useState<{ id: string; name: string } | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    const res = await api.get<Booking[]>('/bookings');
    if (res.success && res.data) setBookings(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    if (activeTab === 'ACTIVE') return b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.IN_PROGRESS;
    if (activeTab === 'COMPLETED') return b.status === BookingStatus.COMPLETED;
    return true;
  });

  const tabs = [
    { id: 'ALL', label: 'All Bookings', count: bookings.length },
    { id: 'ACTIVE', label: 'Active', count: bookings.filter((b) => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.IN_PROGRESS).length },
    { id: 'COMPLETED', label: 'Completed', count: bookings.filter((b) => b.status === BookingStatus.COMPLETED).length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-forest-950 tracking-tight">My Bookings</h1>
        <p className="text-xs text-stone-500 mt-0.5">Live booking status, helper communications, and past service history.</p>
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
          <h3 className="text-base font-bold text-forest-950">No bookings in this tab</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Bookings will appear here once you accept a helper or post a request.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const hasReviewed = booking.reviews && booking.reviews.length > 0;

            return (
              <Card key={booking.id} className="p-6 space-y-4 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={booking.helper?.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'}
                      alt={booking.helper?.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-forest-500/20 shadow-soft-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-forest-950">{booking.helper?.name}</h3>
                      <p className="text-xs text-stone-500">{booking.helper?.phone || 'Verified Pet Helper'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />
                    <span className="text-lg font-black text-forest-900">${booking.agreedPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 bg-forest-50/30 p-3.5 rounded-2xl border border-forest-100/60">
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
                  <span className="text-[11px] text-stone-400">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/chat?bookingId=${booking.id}`}>
                      <Button variant="outline" size="sm" className="text-xs text-stone-700 hover:bg-stone-50 border-stone-200">
                        <MessageSquare className="w-3.5 h-3.5" /> Live Chat
                      </Button>
                    </Link>

                    {booking.status === BookingStatus.COMPLETED && (
                      <Button
                        size="sm"
                        variant={hasReviewed ? 'outline' : 'forest'}
                        disabled={hasReviewed}
                        onClick={() =>
                          setSelectedReviewBooking({
                            id: booking.id,
                            name: booking.helper?.name || 'Helper',
                          })
                        }
                        className="text-xs shadow-soft-sm"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        {hasReviewed ? 'Reviewed ✓' : 'Rate & Review'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedReviewBooking && (
        <ReviewModal
          isOpen={true}
          bookingId={selectedReviewBooking.id}
          targetName={selectedReviewBooking.name}
          onClose={() => setSelectedReviewBooking(null)}
          onReviewSubmitted={() => {
            fetchBookings();
            setSelectedReviewBooking(null);
          }}
        />
      )}
    </div>
  );
}
