'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ServiceRequest, ServiceCategory } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle2,
  Dog,
  ShieldAlert,
  Pill,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function NearbyJobsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const router = useRouter();

  // Category & Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);

  // Counter-offer modal state
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedRequestForOffer, setSelectedRequestForOffer] = useState<any | null>(null);
  const [offeredPrice, setOfferedPrice] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const fetchNearbyJobs = async () => {
    setIsLoading(true);
    const res = await api.get<any[]>('/requests/nearby');
    if (res.success && res.data) {
      setRequests(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNearbyJobs();
  }, []);

  const handleAcceptRequest = async (request: any) => {
    if (!user) return;
    setAcceptingId(request.id);

    const res = await api.post('/bookings', {
      requestId: request.id,
      helperId: user.id,
      agreedPrice: request.budget,
    });

    setAcceptingId(null);

    if (res.success) {
      router.push('/dashboard/helper/bookings');
    } else {
      alert(res.error || 'Failed to accept request');
    }
  };

  const handleOpenOfferModal = (req: any) => {
    setSelectedRequestForOffer(req);
    setOfferedPrice(req.budget?.toString() || '40');
    setProposedTime(req.startTime || '');
    setOfferNote('');
    setOfferModalOpen(true);
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForOffer) return;
    setSubmittingOffer(true);

    const res = await api.post('/offers', {
      requestId: selectedRequestForOffer.id,
      offeredPrice: parseFloat(offeredPrice),
      proposedTime: proposedTime || undefined,
      note: offerNote || undefined,
    });

    setSubmittingOffer(false);

    if (res.success) {
      setOfferModalOpen(false);
      alert('Your offer has been submitted to the pet owner!');
    } else {
      alert(res.error || 'Failed to submit offer');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (showEmergencyOnly && !r.isEmergency) return false;
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-forest-950 tracking-tight">Nearby Pet Care Jobs</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Open requests from pet owners within your service radius ({user?.helperProfile?.serviceRadius || 15} km).
          </p>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200">
        {[
          { id: 'ALL', label: 'All Jobs' },
          { id: ServiceCategory.BASIC_CARE, label: '🐕 Basic Care' },
          { id: ServiceCategory.MEDICAL_HEALTH, label: '🩺 Medical & Health' },
          { id: ServiceCategory.TRANSPORTATION, label: '🚗 Transit' },
          { id: ServiceCategory.EMERGENCY, label: '🚨 Emergency' },
          { id: ServiceCategory.OTHER, label: '✨ Custom' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
              selectedCategory === cat.id
                ? 'bg-white text-forest-950 shadow-soft-sm ring-1 ring-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            )}
          >
            {cat.label}
          </button>
        ))}

        <button
          onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
          className={clsx(
            'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ml-auto flex items-center gap-1.5',
            showEmergencyOnly
              ? 'bg-rose-600 text-white shadow-soft-sm'
              : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
          )}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Emergency Only
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-9 h-9 border-3 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="p-12 text-center space-y-3.5 bg-ivory-50/50 border-stone-200">
          <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto shadow-inner">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-forest-950">No Open Jobs Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No active jobs match your filters right now. Try selecting "All Jobs" or check back shortly.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <Card
              key={req.id}
              hoverable
              className={clsx(
                'p-6 space-y-4 border transition-all shadow-soft-sm hover:shadow-soft-md',
                req.isEmergency
                  ? 'border-rose-300 bg-rose-50/15 ring-1 ring-rose-200'
                  : 'border-stone-200'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={req.pet?.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop'}
                    alt={req.pet?.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-forest-500/30 shadow-soft-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-forest-950">{req.title}</h3>
                      {req.isEmergency && (
                        <span className="px-2.5 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse">
                          <ShieldAlert className="w-3 h-3" /> Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-forest-700 font-semibold mt-0.5">
                      {req.pet?.name} ({req.pet?.breed || req.pet?.species})
                    </p>
                    <span className="text-[11px] text-stone-400">
                      Posted by {req.owner?.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-forest-800">${req.budget.toFixed(2)}</span>
                  {req.distanceKm !== undefined && (
                    <span className="text-[11px] block font-bold text-stone-500">
                      📍 ~{req.distanceKm} km away
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                <div className="flex items-center gap-2 text-stone-600">
                  <Calendar className="w-3.5 h-3.5 text-forest-600" />
                  <span>{new Date(req.scheduledDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <Clock className="w-3.5 h-3.5 text-forest-600" />
                  <span>{req.startTime} {req.endTime ? `- ${req.endTime}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 col-span-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                  <span className="truncate">{req.location} (Approximate)</span>
                </div>
              </div>

              {/* Medicine details if provided */}
              {req.medicineDetails && (
                <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-1">
                  <div className="font-bold text-rose-950 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-rose-600" />
                    <span>Medication: {req.medicineDetails.medicineName} ({req.medicineDetails.dosage})</span>
                  </div>
                  <p className="text-rose-900 text-[11px]">
                    Frequency: {req.medicineDetails.frequency} • {req.medicineDetails.instructions}
                  </p>
                </div>
              )}

              {req.description && (
                <p className="text-xs text-stone-600 bg-forest-50/30 p-2.5 rounded-xl border border-forest-100/50">
                  <span className="font-bold text-forest-950">Notes:</span> {req.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 gap-2">
                <Badge variant="brand">{req.serviceType.replace('_', ' ')}</Badge>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs text-stone-700 hover:bg-stone-50 border-stone-200"
                    onClick={() => handleOpenOfferModal(req)}
                  >
                    Send Custom Offer
                  </Button>
                  <Button
                    size="sm"
                    variant={req.isEmergency ? 'danger' : 'forest'}
                    isLoading={acceptingId === req.id}
                    onClick={() => handleAcceptRequest(req)}
                    className="text-xs shadow-soft-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept Job (${req.budget})
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Send Counter-Offer Modal */}
      {selectedRequestForOffer && (
        <Modal
          isOpen={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
          title={`Send Counter-Offer for ${selectedRequestForOffer.title}`}
          maxWidth="md"
        >
          <form onSubmit={handleSendOffer} className="space-y-4">
            <div className="p-3.5 bg-ivory-50 rounded-xl text-xs space-y-1 border border-stone-200">
              <p className="text-stone-600">
                Pet: <span className="font-bold text-forest-950">{selectedRequestForOffer.pet?.name}</span> •
                Original Budget: <span className="font-bold text-forest-800">${selectedRequestForOffer.budget}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Your Offered Price ($ USD) *"
                type="number"
                min="1"
                required
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
              />
              <Input
                label="Proposed Start Time"
                placeholder="e.g. 02:30 PM"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 tracking-wide mb-1.5">
                Note for Pet Owner (Qualifications & Availability)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. I am 5 minutes away and CPR certified. I can take extra great care of your pet!"
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:ring-2 focus:ring-forest-500/20 focus:border-forest-600 outline-none resize-none transition-all shadow-soft-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOfferModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="forest" isLoading={submittingOffer} className="shadow-soft-sm">
                <Send className="w-3.5 h-3.5" /> Submit Counter-Offer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
