'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Pet, ServiceRequest, Booking } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AddPetModal } from '@/components/modals/AddPetModal';
import {
  Dog,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  Stethoscope,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export default function OwnerOverviewPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const [petsRes, reqRes, bookRes] = await Promise.all([
      api.get<Pet[]>('/pets'),
      api.get<ServiceRequest[]>('/requests/my'),
      api.get<Booking[]>('/bookings'),
    ]);

    if (petsRes.success && petsRes.data) setPets(petsRes.data);
    if (reqRes.success && reqRes.data) setRequests(reqRes.data);
    if (bookRes.success && bookRes.data) setBookings(bookRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
  const openRequests = requests.filter((r) => r.status === 'OPEN');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Warm Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-teal-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> Pet Parent Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80">
            {pets.length} {pets.length === 1 ? 'pet' : 'pets'} registered • {activeBookings.length} active appointment{activeBookings.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/owner/requests/new" className="w-full sm:w-auto">
            <Button size="md" className="w-full sm:w-auto bg-warm-500 hover:bg-warm-600 text-slate-900 font-extrabold shadow-md">
              <PlusCircle className="w-4 h-4 mr-1" /> Request Help 🐾
            </Button>
          </Link>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsAddPetOpen(true)}
            className="border-white/20 text-white bg-white/10 hover:bg-white/20"
          >
            <Dog className="w-4 h-4 mr-1" /> Add Pet
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center justify-between bg-white border-stone-200/80">
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Registered Pets</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{pets.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
            <Dog className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between bg-white border-stone-200/80">
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Open Requests</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{openRequests.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between bg-white border-stone-200/80">
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Active Bookings</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{activeBookings.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Calendar className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Active Bookings Section */}
      {activeBookings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Active Bookings
            </h3>
            <Link href="/dashboard/owner/bookings" className="text-xs font-bold text-teal-700 hover:underline">
              View all bookings →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <Card key={b.id} className="border-teal-200/80 bg-[#fcfaf6] p-5 space-y-4 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.helper?.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'}
                      alt={b.helper?.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-teal-600/30"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{b.helper?.name}</h4>
                      <p className="text-xs text-stone-500">Verified Helper</p>
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200/70 text-xs space-y-1">
                  <p className="font-bold text-slate-900">
                    {b.request?.serviceType?.replace('_', ' ')} for {b.request?.pet?.name}
                  </p>
                  <p className="text-stone-500 text-[11px]">
                    📅 {new Date(b.request?.scheduledDate || '').toLocaleDateString()} @ {b.request?.startTime} • 📍 {b.request?.location}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-black text-emerald-800">${b.agreedPrice.toFixed(2)}</span>
                  <Link href={`/dashboard/chat?bookingId=${b.id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> Chat with Helper
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Pets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">My Pets ({pets.length})</h3>
            <p className="text-xs text-stone-500">Your registered companions and their active health profiles.</p>
          </div>
          <button
            onClick={() => setIsAddPetOpen(true)}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" /> Add a Pet
          </button>
        </div>

        {pets.length === 0 ? (
          <Card className="p-12 text-center space-y-3 bg-[#fdfbf7] border-stone-200/80">
            <Dog className="w-12 h-12 text-stone-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">No Pets on File Yet</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Add your dog, cat, or other pet to start requesting neighborhood walks, medication, or sitting.
            </p>
            <Button size="sm" onClick={() => setIsAddPetOpen(true)}>
              Register Pet Profile Now
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <Card key={pet.id} hoverable className="p-4 space-y-3 bg-white border-stone-200/80 rounded-2xl">
                <div className="flex items-center gap-3">
                  <img
                    src={pet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop'}
                    alt={pet.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100 shadow-soft-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">{pet.name}</h4>
                    <p className="text-xs text-stone-500 truncate">{pet.breed || pet.species}</p>
                    <span className="text-[11px] text-teal-700 font-bold block mt-0.5">
                      {pet.age ? `${pet.age} yrs` : 'Age N/A'} • {pet.gender || 'Pet'}
                    </span>
                  </div>
                </div>

                {(pet.medicalConditions || pet.medications) && (
                  <p className="text-[11px] text-rose-800 bg-rose-50/70 p-2 rounded-xl border border-rose-200/80 truncate font-semibold">
                    🩺 {pet.medicalConditions || pet.medications}
                  </p>
                )}

                <Link href={`/dashboard/owner/requests/new?petId=${pet.id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs mt-1">
                    Request Care for {pet.name}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddPetModal
        isOpen={isAddPetOpen}
        onClose={() => setIsAddPetOpen(false)}
        onPetAdded={(newPet) => setPets([newPet, ...pets])}
      />
    </div>
  );
}
