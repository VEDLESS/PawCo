'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ServiceType, VerificationStatus } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  UserCheck,
  DollarSign,
  MapPin,
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function HelperProfileSettingsPage() {
  const { user, updateUser } = useAuth();
  const profile = user?.helperProfile;

  const [bio, setBio] = useState(profile?.bio || '');
  const [experience, setExperience] = useState(profile?.experience || '');
  const [hourlyRate, setHourlyRate] = useState(profile?.hourlyRate?.toString() || '30');
  const [serviceRadius, setServiceRadius] = useState(profile?.serviceRadius?.toString() || '15');
  const [services, setServices] = useState<ServiceType[]>(
    profile?.services || [ServiceType.DOG_WALKING, ServiceType.PET_SITTING]
  );
  const [pricing, setPricing] = useState<Record<string, number>>(
    (profile?.pricing as Record<string, number>) || {
      DOG_WALKING: 30,
      PET_SITTING: 60,
      FEEDING: 25,
      GROOMING: 45,
      BATHING: 40,
      PET_BOARDING: 75,
      MEDICINE_ADMINISTRATION: 40,
      MEDICINE_PICKUP: 30,
      VET_VISIT_ASSISTANCE: 50,
      VET_TRANSPORTATION: 45,
      EMERGENCY_VET_ASSISTANCE: 65,
    }
  );
  const [workingDays, setWorkingDays] = useState<string[]>(
    profile?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  );
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const allAvailableServices = [
    { type: ServiceType.DOG_WALKING, label: '🐕 Dog Walking', defaultPrice: 30 },
    { type: ServiceType.PET_SITTING, label: '🏠 Pet Sitting', defaultPrice: 60 },
    { type: ServiceType.FEEDING, label: '🥣 Feeding & Care', defaultPrice: 25 },
    { type: ServiceType.GROOMING, label: '✂️ Pet Grooming', defaultPrice: 45 },
    { type: ServiceType.BATHING, label: '🛁 Bathing & Spa', defaultPrice: 40 },
    { type: ServiceType.PET_BOARDING, label: '🛏️ Pet Boarding', defaultPrice: 75 },
    { type: ServiceType.MEDICINE_ADMINISTRATION, label: '💊 Medicine Administration', defaultPrice: 40 },
    { type: ServiceType.MEDICINE_PICKUP, label: '📦 Medicine Pickup', defaultPrice: 30 },
    { type: ServiceType.VET_VISIT_ASSISTANCE, label: '🩺 Vet Visit Assistance', defaultPrice: 50 },
    { type: ServiceType.POST_SURGERY_CARE, label: '🩹 Post-Surgery Care', defaultPrice: 55 },
    { type: ServiceType.VET_TRANSPORTATION, label: '🚗 Vet Transportation', defaultPrice: 45 },
    { type: ServiceType.EMERGENCY_VET_ASSISTANCE, label: '🚨 Emergency Vet Assistance', defaultPrice: 65 },
    { type: ServiceType.EMERGENCY_CHECK_IN, label: '⚡ Emergency Check-in', defaultPrice: 45 },
    { type: ServiceType.CUSTOM_REQUEST, label: '✨ Custom Pet Care', defaultPrice: 35 },
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleService = (type: ServiceType) => {
    if (services.includes(type)) {
      if (services.length > 1) {
        setServices(services.filter((s) => s !== type));
      }
    } else {
      setServices([...services, type]);
    }
  };

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      if (workingDays.length > 1) {
        setWorkingDays(workingDays.filter((d) => d !== day));
      }
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handlePriceChange = (serviceType: string, priceStr: string) => {
    const val = parseFloat(priceStr) || 0;
    setPricing((prev) => ({ ...prev, [serviceType]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSavedSuccess(false);

    const res = await api.put('/helpers/profile', {
      bio,
      experience,
      hourlyRate: parseFloat(hourlyRate),
      serviceRadius: parseFloat(serviceRadius),
      services,
      pricing,
      workingDays,
    });

    setIsLoading(false);

    if (res.success && res.data) {
      updateUser({ helperProfile: res.data });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      alert(res.error || 'Failed to save helper profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-forest-950 tracking-tight">Helper Profile & Service Matrix</h1>
          {profile?.verificationStatus === VerificationStatus.VERIFIED ? (
            <span className="px-3 py-1 bg-forest-100 text-forest-800 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-soft-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-600" /> ✓ Verified Provider
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-soft-sm">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Verification Pending Review
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Configure your service catalog, customized rate card, working availability, and credentials.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-forest-50 border border-forest-200 text-forest-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-soft-sm">
          <Check className="w-4 h-4 text-forest-600" /> Profile settings and pricing matrix saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Coverage & Base Rate */}
        <Card className="p-6 space-y-5 border-stone-200 shadow-soft-sm">
          <h3 className="text-sm font-extrabold text-forest-900 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-forest-600" /> Base Rates & Service Radius
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Hourly Rate ($ USD) *"
              type="number"
              min="5"
              required
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold text-stone-700 tracking-wide mb-1.5">
                Service Radius ({serviceRadius} km)
              </label>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={serviceRadius}
                onChange={(e) => setServiceRadius(e.target.value)}
                className="w-full accent-forest-600 mt-2"
              />
              <span className="text-[11px] text-stone-400">
                You will receive job notifications within {serviceRadius} km from your home.
              </span>
            </div>
          </div>
        </Card>

        {/* Services & Custom Pricing Matrix */}
        <Card className="p-6 space-y-4 border-stone-200 shadow-soft-sm">
          <div>
            <h3 className="text-sm font-extrabold text-forest-900 uppercase tracking-wider">
              Services Offered & Custom Pricing Matrix
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select services you provide and specify your custom pricing per service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allAvailableServices.map((s) => {
              const isChecked = services.includes(s.type);
              const customPrice = pricing[s.type] ?? s.defaultPrice;

              return (
                <div
                  key={s.type}
                  className={clsx(
                    'p-3.5 rounded-2xl border transition-all space-y-2',
                    isChecked
                      ? 'bg-forest-50/50 border-forest-300 ring-1 ring-forest-200/80 shadow-soft-sm'
                      : 'bg-white border-stone-200 opacity-75'
                  )}
                >
                  <div
                    onClick={() => toggleService(s.type)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-xs font-bold text-forest-950">{s.label}</span>
                    <div
                      className={clsx(
                        'w-5 h-5 rounded-md flex items-center justify-center border transition-all',
                        isChecked ? 'bg-forest-600 border-forest-600 text-white' : 'border-stone-300 bg-white'
                      )}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {isChecked && (
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-stone-500 font-semibold">Service Rate ($ USD):</span>
                      <input
                        type="number"
                        min="5"
                        value={customPrice}
                        onChange={(e) => handlePriceChange(s.type, e.target.value)}
                        className="w-20 px-2.5 py-1 bg-white border border-forest-200 rounded-lg text-right font-bold text-forest-950 outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-600"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Working Days & Schedule */}
        <Card className="p-6 space-y-4 border-stone-200 shadow-soft-sm">
          <div>
            <h3 className="text-sm font-extrabold text-forest-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-forest-600" /> Working Days & Availability
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select the days of the week you are actively taking pet care jobs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => {
              const isActive = workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={clsx(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition-all',
                    isActive
                      ? 'bg-forest-700 text-white shadow-soft-sm ring-1 ring-forest-800'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  )}
                >
                  {day} {isActive ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Bio & Credentials */}
        <Card className="p-6 space-y-4 border-stone-200 shadow-soft-sm">
          <h3 className="text-sm font-extrabold text-forest-900 uppercase tracking-wider">
            Biography & Veterinary Experience
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 tracking-wide mb-1.5">
              Public Bio & Introduction
            </label>
            <textarea
              rows={3}
              placeholder="Tell pet owners why you love caring for animals and what makes you reliable..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:ring-2 focus:ring-forest-500/20 focus:border-forest-600 outline-none resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 tracking-wide mb-1.5">
              Experience, Certifications & Pet Medical Background
            </label>
            <textarea
              rows={2}
              placeholder="List certifications (Pet CPR, Vet Assistant), experience with specific breeds or medical needs..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:ring-2 focus:ring-forest-500/20 focus:border-forest-600 outline-none resize-none transition-all"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="forest" size="lg" isLoading={isLoading} className="shadow-soft-md">
            Save Profile & Matrix Settings 🐾
          </Button>
        </div>
      </form>
    </div>
  );
}
