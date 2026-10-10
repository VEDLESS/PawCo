'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ServiceRequest, RequestStatus, HelperOffer } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import {
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Trash2,
  ShieldAlert,
  Pill,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Star,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function OwnerRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [smartMatches, setSmartMatches] = useState<Record<string, any[]>>({});
  const [loadingMatchId, setLoadingMatchId] = useState<string | null>(null);
  const [acceptingOfferId, setAcceptingOfferId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    const res = await api.get<ServiceRequest[]>('/requests/my');
    if (res.success && res.data) setRequests(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelRequest = async (id: string) => {
    if (confirm('Are you sure you want to cancel this request?')) {
      const res = await api.delete(`/requests/${id}`);
      if (res.success) {
        setRequests(requests.filter((r) => r.id !== id));
      }
    }
  };

  const handleLoadSmartMatches = async (requestId: string) => {
    setLoadingMatchId(requestId);
    const res = await api.get<any[]>(`/matching/requests/${requestId}`);
    if (res.success && res.data) {
      setSmartMatches((prev) => ({ ...prev, [requestId]: res.data! }));
    }
    setLoadingMatchId(null);
  };

  const handleAcceptOffer = async (offerId: string) => {
    setAcceptingOfferId(offerId);
    const res = await api.post(`/offers/${offerId}/accept`, {});
    setAcceptingOfferId(null);

    if (res.success && res.data) {
      router.push('/dashboard/owner/bookings');
    } else {
      alert(res.error || 'Failed to accept helper offer');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'OPEN') return r.status === RequestStatus.OPEN;
    if (activeTab === 'ACTIVE') return r.status === RequestStatus.ACCEPTED || r.status === RequestStatus.IN_PROGRESS;
    if (activeTab === 'COMPLETED') return r.status === RequestStatus.COMPLETED;
    return true;
  });

  const tabs = [
    { id: 'ALL', label: 'All Requests', count: requests.length },
    { id: 'OPEN', label: 'Open / Receiving Offers', count: requests.filter((r) => r.status === RequestStatus.OPEN).length },
    { id: 'ACTIVE', label: 'Active Bookings', count: requests.filter((r) => r.status === RequestStatus.ACCEPTED || r.status === RequestStatus.IN_PROGRESS).length },
    { id: 'COMPLETED', label: 'Completed', count: requests.filter((r) => r.status === RequestStatus.COMPLETED).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-forest-950 tracking-tight">My Care Requests & Offers</h1>
          <p className="text-xs text-stone-500 mt-0.5">Track posted requests, review incoming helper counter-offers, and manage bookings.</p>
        </div>
        <Link href="/dashboard/owner/requests/new">
          <Button variant="forest" className="shadow-soft-sm">
            <PlusCircle className="w-4 h-4" /> Request Help 🐾
          </Button>
        </Link>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-9 h-9 border-3 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="p-12 text-center space-y-3.5 bg-ivory-50/50 border-stone-200">
          <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-forest-950">No requests found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You do not have any requests in this view. Post a new request whenever your pet needs care.
          </p>
          <Link href="/dashboard/owner/requests/new" className="inline-block pt-1">
            <Button size="sm" variant="forest">Create a Request</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-5">
          {filteredRequests.map((req) => (
            <Card key={req.id} hoverable className="p-6 space-y-4 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={req.pet?.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop'}
                    alt={req.pet?.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-forest-500/30 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-forest-950">{req.title}</h3>
                      {req.isEmergency && (
                        <span className="px-2.5 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse">
                          <ShieldAlert className="w-3 h-3" /> Emergency
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-forest-700 font-semibold mt-0.5">
                      For {req.pet?.name} ({req.serviceType.replace('_', ' ')}) • Category: {req.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={req.status} />
                  <span className="text-xl font-black text-forest-900">${req.budget.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest-600" />
                  <span>{new Date(req.scheduledDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-600" />
                  <span>{req.startTime} {req.endTime ? `- ${req.endTime}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
                  <span className="truncate">{req.location}</span>
                </div>
              </div>

              {/* Medicine details if attached */}
              {req.medicineDetails && (
                <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-1">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-rose-600" />
                    <span>Medication: {req.medicineDetails.medicineName} ({req.medicineDetails.dosage})</span>
                  </div>
                  <p className="text-rose-800 text-[11px]">
                    Frequency: {req.medicineDetails.frequency} • Supervising Vet: {req.medicineDetails.vetName || 'On file'}
                  </p>
                </div>
              )}

              {req.description && (
                <p className="text-xs text-slate-500 leading-relaxed">{req.description}</p>
              )}

              {/* Helper Offers Section */}
              {req.offers && req.offers.length > 0 && (
                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Incoming Helper Offers ({req.offers.length})
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {req.offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="p-4 bg-forest-50/40 rounded-2xl border border-forest-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-forest-950">{offer.helper?.name || 'Verified Helper'}</span>
                            <span className="font-black text-forest-800 bg-forest-100/90 px-2.5 py-0.5 rounded-full text-[11px]">
                              Offer: ${offer.offeredPrice.toFixed(2)}
                            </span>
                            {offer.proposedTime && (
                              <span className="text-stone-500 text-[11px]">Proposed: {offer.proposedTime}</span>
                            )}
                          </div>
                          {offer.note && (
                            <p className="text-stone-600 text-[11px] italic">"{offer.note}"</p>
                          )}
                        </div>

                        {req.status === RequestStatus.OPEN && (
                          <Button
                            size="sm"
                            variant="forest"
                            isLoading={acceptingOfferId === offer.id}
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="shrink-0 text-xs shadow-soft-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accept Offer & Book
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Recommendations & Actions Section */}
              {req.status === RequestStatus.OPEN && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-forest-800 border-forest-200 hover:bg-forest-50"
                    isLoading={loadingMatchId === req.id}
                    onClick={() => handleLoadSmartMatches(req.id)}
                  >
                    <Users className="w-3.5 h-3.5" /> View Recommended Helpers
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs"
                    onClick={() => handleCancelRequest(req.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Cancel Request
                  </Button>
                </div>
              )}

              {/* Smart Match Results Drawer */}
              {smartMatches[req.id] && smartMatches[req.id].length > 0 && (
                <div className="p-4 bg-ivory-50/60 rounded-2xl border border-stone-200 space-y-3 mt-3 animate-in fade-in duration-200">
                  <h5 className="text-xs font-extrabold text-forest-950 uppercase tracking-wider flex items-center gap-1.5">
                    🎯 Top Ranked Helpers Near You
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {smartMatches[req.id].slice(0, 4).map((m: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-white rounded-xl border border-stone-200/80 text-xs space-y-1.5 shadow-soft-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-forest-950">{m.helperName}</span>
                          <span className="px-2 py-0.5 bg-forest-100 text-forest-800 font-extrabold text-[10px] rounded-full">
                            Score: {m.score}/100
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="text-amber-600 font-bold">★ {m.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>📍 {m.distanceKm} km away</span>
                          <span>•</span>
                          <span className="font-bold text-forest-900">${m.hourlyRate}/hr</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {m.matchReasons.map((reason: string, rIdx: number) => (
                            <span key={rIdx} className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded-md font-medium">
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
