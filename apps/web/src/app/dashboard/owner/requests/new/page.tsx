'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Pet, ServiceCategory, ServiceType } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { AddPetModal } from '@/components/modals/AddPetModal';
import {
  Dog,
  Footprints,
  Home,
  Utensils,
  Pill,
  Bed,
  Scissors,
  AlertCircle,
  HeartHandshake,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  Car,
  Stethoscope,
  ShieldAlert,
  Sparkles,
  PartyPopper,
  Share2,
} from 'lucide-react';
import { clsx } from 'clsx';

interface ServiceOptionItem {
  type: ServiceType;
  category: ServiceCategory;
  label: string;
  description: string;
  icon: any;
  defaultPrice: string;
  defaultTitle: string;
  isEmergency?: boolean;
}

const ALL_SERVICES: ServiceOptionItem[] = [
  // Basic Care
  {
    type: ServiceType.DOG_WALKING,
    category: ServiceCategory.BASIC_CARE,
    label: 'Dog Walking',
    description: 'Energetic pack or solo neighborhood walks with hydration & GPS check-in.',
    icon: Footprints,
    defaultPrice: '35',
    defaultTitle: 'Dog Walking & Park Run',
  },
  {
    type: ServiceType.PET_SITTING,
    category: ServiceCategory.BASIC_CARE,
    label: 'In-Home Pet Sitting',
    description: 'Loving companionship, interactive playtime, and dedicated attention.',
    icon: Home,
    defaultPrice: '60',
    defaultTitle: 'In-Home Pet Sitting & Companionship',
  },
  {
    type: ServiceType.FEEDING,
    category: ServiceCategory.BASIC_CARE,
    label: 'Feeding & Care',
    description: 'Scheduled fresh meal prep, filtered water refresh, and litter maintenance.',
    icon: Utensils,
    defaultPrice: '25',
    defaultTitle: 'Scheduled Meal & Water Refresh',
  },
  {
    type: ServiceType.GROOMING,
    category: ServiceCategory.BASIC_CARE,
    label: 'Pet Grooming',
    description: 'Brushing, nail trimming, ear cleaning, and light deshedding.',
    icon: Scissors,
    defaultPrice: '50',
    defaultTitle: 'Bath, Brush & Deshedding',
  },
  {
    type: ServiceType.BATHING,
    category: ServiceCategory.BASIC_CARE,
    label: 'Warm Bath & Spa',
    description: 'Hypoallergenic warm sudsy bath, paw scrub, and gentle blow dry.',
    icon: Sparkles,
    defaultPrice: '40',
    defaultTitle: 'Warm Bath & Grooming Spa',
  },
  {
    type: ServiceType.PET_BOARDING,
    category: ServiceCategory.BASIC_CARE,
    label: 'Home Boarding',
    description: 'Overnight caring stay in a verified helper’s loving home with yard play.',
    icon: Bed,
    defaultPrice: '75',
    defaultTitle: 'Overnight Home Boarding',
  },

  // Medical / Health
  {
    type: ServiceType.MEDICINE_ADMINISTRATION,
    category: ServiceCategory.MEDICAL_HEALTH,
    label: 'Medicine Administration',
    description: 'Gentle oral tablets, ear/eye drops, insulin, or topical ointment application.',
    icon: Pill,
    defaultPrice: '40',
    defaultTitle: 'Prescribed Medicine Administration',
  },
  {
    type: ServiceType.MEDICINE_PICKUP,
    category: ServiceCategory.MEDICAL_HEALTH,
    label: 'Medicine Pickup & Delivery',
    description: 'Prompt prescription retrieval directly from your veterinary hospital.',
    icon: Pill,
    defaultPrice: '30',
    defaultTitle: 'Veterinary Prescription Pickup',
  },
  {
    type: ServiceType.VET_VISIT_ASSISTANCE,
    category: ServiceCategory.MEDICAL_HEALTH,
    label: 'Vet Visit Assistance',
    description: 'Experienced helper accompanies pet and parent to veterinary appointments.',
    icon: Stethoscope,
    defaultPrice: '50',
    defaultTitle: 'Veterinary Appointment Accompaniment',
  },
  {
    type: ServiceType.VET_CONSULTATION,
    category: ServiceCategory.MEDICAL_HEALTH,
    label: 'Vet Consultation Support',
    description: 'Helper assists in setting up and facilitating online or in-person vet review.',
    icon: Stethoscope,
    defaultPrice: '45',
    defaultTitle: 'Vet Consultation Support',
  },
  {
    type: ServiceType.POST_SURGERY_CARE,
    category: ServiceCategory.MEDICAL_HEALTH,
    label: 'Post-Surgery Recovery Care',
    description: 'Quiet supervision, cone checks, gentle wound monitoring, and calm resting.',
    icon: HeartHandshake,
    defaultPrice: '65',
    defaultTitle: 'Post-Surgical Recovery Monitoring',
  },
  {
    type: ServiceType.HEALTH_CHECK_ASSISTANCE,
    category: ServiceCategory.MEDICAL_HEALTH,
    label: 'Health & Wellness Check',
    description: 'Comprehensive vital check, weight logging, and wellness observation.',
    icon: Stethoscope,
    defaultPrice: '35',
    defaultTitle: 'Pet Vital & Wellness Check',
  },

  // Transportation
  {
    type: ServiceType.VET_TRANSPORTATION,
    category: ServiceCategory.TRANSPORTATION,
    label: 'Vet Transportation Ride',
    description: 'Safe, secured carrier transit directly to clinic and back home.',
    icon: Car,
    defaultPrice: '45',
    defaultTitle: 'Safe Transit to Veterinary Clinic',
  },
  {
    type: ServiceType.PET_PICKUP_DROP,
    category: ServiceCategory.TRANSPORTATION,
    label: 'Pet Shuttle & Taxi',
    description: 'Daycare, grooming salon, or airport pet shuttle services.',
    icon: Car,
    defaultPrice: '35',
    defaultTitle: 'Pet Taxi / Shuttle Service',
  },
  {
    type: ServiceType.EMERGENCY_TRANSPORTATION,
    category: ServiceCategory.TRANSPORTATION,
    label: 'Emergency Pet Transit',
    description: 'Priority rapid transit to the nearest 24/7 animal emergency hospital.',
    icon: ShieldAlert,
    defaultPrice: '80',
    defaultTitle: 'Urgent Transit to Animal ER',
    isEmergency: true,
  },

  // Emergency
  {
    type: ServiceType.EMERGENCY_VET_ASSISTANCE,
    category: ServiceCategory.EMERGENCY,
    label: 'Emergency Vet Assistance',
    description: 'Immediate hands-on aid and accompaniment to 24/7 ER hospital.',
    icon: ShieldAlert,
    defaultPrice: '90',
    defaultTitle: '🚨 URGENT: Emergency Vet Assistance',
    isEmergency: true,
  },
  {
    type: ServiceType.EMERGENCY_CHECK_IN,
    category: ServiceCategory.EMERGENCY,
    label: 'Emergency Wellness Check-in',
    description: 'Urgent rapid home visit if you cannot reach your pet.',
    icon: AlertCircle,
    defaultPrice: '50',
    defaultTitle: 'Urgent Home Wellness Check-in',
    isEmergency: true,
  },
  {
    type: ServiceType.LOST_PET_ASSISTANCE,
    category: ServiceCategory.EMERGENCY,
    label: 'Lost Pet Search Alert',
    description: 'Mobilize verified nearby helpers for immediate neighborhood search.',
    icon: AlertCircle,
    defaultPrice: '60',
    defaultTitle: '🚨 URGENT: Lost Pet Neighborhood Search',
    isEmergency: true,
  },

  // Other / Custom
  {
    type: ServiceType.CUSTOM_REQUEST,
    category: ServiceCategory.OTHER,
    label: 'Custom Pet Care Request',
    description: 'Specialized requirements tailored to your pet’s unique daily routine.',
    icon: Sparkles,
    defaultPrice: '40',
    defaultTitle: 'Specialized Custom Pet Care Request',
  },
];

function CreateRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPetId = searchParams.get('petId');

  const [pets, setPets] = useState<Pet[]>([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success Confirmation State
  const [createdRequestData, setCreatedRequestData] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Selected Category filter for Step 2
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(ServiceCategory.BASIC_CARE);

  // Form State
  const [selectedPetId, setSelectedPetId] = useState(preselectedPetId || '');
  const [selectedService, setSelectedService] = useState<ServiceOptionItem>(ALL_SERVICES[0]);
  const [title, setTitle] = useState(ALL_SERVICES[0].defaultTitle);
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [location, setLocation] = useState('Dolores Park, San Francisco, CA');
  const [latitude, setLatitude] = useState(37.7596);
  const [longitude, setLongitude] = useState(-122.4269);
  const [budget, setBudget] = useState('35');
  const [isEmergency, setIsEmergency] = useState(false);

  // Medicine Specific Fields
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');
  const [medInstructions, setMedInstructions] = useState('');
  const [medVetName, setMedVetName] = useState('');
  const [medVetPhone, setMedVetPhone] = useState('');

  useEffect(() => {
    const loadPets = async () => {
      const res = await api.get<Pet[]>('/pets');
      if (res.success && res.data) {
        setPets(res.data);
        if (!selectedPetId && res.data.length > 0) {
          setSelectedPetId(res.data[0].id);
        }
      }
    };
    loadPets();
  }, []);

  const handleServiceSelect = (opt: ServiceOptionItem) => {
    setSelectedService(opt);
    setTitle(opt.defaultTitle);
    setBudget(opt.defaultPrice);
    setIsEmergency(Boolean(opt.isEmergency));
  };

  const isMedicalService =
    selectedService.category === ServiceCategory.MEDICAL_HEALTH ||
    selectedService.type === ServiceType.MEDICINE_ADMINISTRATION ||
    selectedService.type === ServiceType.MEDICINE_PICKUP;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const medicineDetails =
      isMedicalService && medName
        ? {
            medicineName: medName,
            dosage: medDosage,
            frequency: medFrequency,
            instructions: medInstructions,
            vetName: medVetName,
            vetPhone: medVetPhone,
          }
        : undefined;

    const payload = {
      petId: selectedPetId,
      category: selectedService.category,
      serviceType: selectedService.type,
      title,
      description: description || `Care request for ${selectedService.label}`,
      location,
      latitude,
      longitude,
      scheduledDate,
      startTime,
      endTime: endTime || null,
      budget: parseFloat(budget),
      isEmergency,
      medicineDetails,
    };

    const res = await api.post('/requests', payload);
    setIsLoading(false);

    if (res.success && res.data) {
      setCreatedRequestData(res.data);
      setShowSuccessModal(true);
    } else {
      setError(res.error || 'Failed to submit service request');
    }
  };

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const filteredServices = ALL_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header & Step Bar */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post a Pet Care Request</h1>
          {isEmergency && (
            <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5" /> Emergency Priority
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Reach background-verified neighborhood pet helpers across San Francisco in minutes.
        </p>

        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-between mt-6 max-w-lg">
          {['Select Pet', 'Service Category', 'Schedule & Meds', 'Review & Post'].map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                    isCompleted
                      ? 'bg-teal-700 text-white'
                      : isCurrent
                      ? 'bg-teal-100 text-teal-800 ring-2 ring-teal-700 font-extrabold'
                      : 'bg-stone-200 text-stone-500'
                  )}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span
                  className={clsx(
                    'text-xs font-semibold hidden sm:inline',
                    isCurrent ? 'text-teal-900 font-bold' : 'text-stone-400'
                  )}
                >
                  {label}
                </span>
                {idx < 3 && <div className="w-6 sm:w-10 h-0.5 bg-stone-200" />}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Emergency Advisory Disclaimer */}
      {isEmergency && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs space-y-1.5 shadow-soft-sm">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Emergency Advisory & Disclaimer</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            PawCo connects pet owners with local community helpers and is not a substitute for licensed emergency veterinary hospital care. In life-threatening emergencies, please transport your pet directly to a 24/7 veterinary ER or call your local animal hospital immediately.
          </p>
        </div>
      )}

      {/* Step 1: Select Pet */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Which companion needs care?</h3>
            <button
              onClick={() => setIsAddPetOpen(true)}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> Add a new pet
            </button>
          </div>

          {pets.length === 0 ? (
            <Card className="p-10 text-center space-y-3 bg-[#fdfbf7] border-stone-200/80">
              <Dog className="w-12 h-12 text-stone-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No pets registered yet</h4>
              <p className="text-xs text-stone-500">Please register your pet before posting care requests.</p>
              <Button size="sm" onClick={() => setIsAddPetOpen(true)}>
                Add Pet Now
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pets.map((pet) => {
                const isSelected = selectedPetId === pet.id;
                return (
                  <div
                    key={pet.id}
                    onClick={() => setSelectedPetId(pet.id)}
                    className={clsx(
                      'p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4',
                      isSelected
                        ? 'border-teal-700 bg-teal-50/60 ring-2 ring-teal-600/20 shadow-soft-sm'
                        : 'border-stone-200/80 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                    )}
                  >
                    <img
                      src={pet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop'}
                      alt={pet.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-soft-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">{pet.name}</h4>
                      <p className="text-xs text-stone-500 truncate">{pet.breed || pet.species} • {pet.age ? `${pet.age} yrs` : 'Age N/A'}</p>
                      {pet.medicalConditions && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-md truncate max-w-full">
                          🩺 {pet.medicalConditions}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              disabled={!selectedPetId}
              onClick={() => setStep(2)}
            >
              Continue to Service Category <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Category & Service */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">What service does {selectedPet?.name} need?</h3>
            <p className="text-xs text-stone-500 mt-0.5">Select a category below to explore available offerings.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200/80">
            {[
              { id: ServiceCategory.BASIC_CARE, label: '🐕 Basic Care', count: 6 },
              { id: ServiceCategory.MEDICAL_HEALTH, label: '🩺 Medical & Health', count: 6 },
              { id: ServiceCategory.TRANSPORTATION, label: '🚗 Transit', count: 3 },
              { id: ServiceCategory.EMERGENCY, label: '🚨 Emergency', count: 3 },
              { id: ServiceCategory.OTHER, label: '✨ Custom', count: 1 },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
                  activeCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-soft-sm ring-1 ring-stone-200'
                    : 'text-stone-600 hover:text-slate-900 hover:bg-white/50'
                )}
              >
                <span>{cat.label}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-stone-200/80 text-stone-600">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredServices.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedService.type === opt.type;

              return (
                <div
                  key={opt.type}
                  onClick={() => handleServiceSelect(opt)}
                  className={clsx(
                    'p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3',
                    isSelected
                      ? 'border-teal-700 bg-teal-50/50 ring-2 ring-teal-600/20 shadow-soft-sm'
                      : opt.isEmergency
                      ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
                      : 'border-stone-200/80 bg-white hover:border-stone-300'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : opt.isEmergency
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-stone-100 text-stone-700'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">{opt.label}</h4>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 ml-1" />}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">{opt.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <span className="text-stone-400 font-semibold">Suggested Budget</span>
                    <span className="font-black text-slate-900">${opt.defaultPrice}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button size="lg" onClick={() => setStep(3)}>
              Continue to Details <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Schedule, Meds & Budget */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <h3 className="text-base font-extrabold text-slate-900">Configure Service Schedule & Instructions</h3>

          <div className="space-y-4">
            <Input
              label="Request Title *"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Date *"
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              <Input
                label="Start Time *"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Service Location / Address *"
                required
                placeholder="e.g. Dolores Park, San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                label="Budget ($ USD) *"
                type="number"
                min="1"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            {/* Medicine Section if Medical Service */}
            {isMedicalService && (
              <Card className="p-5 border-rose-200 bg-rose-50/30 space-y-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-rose-600" />
                  <h4 className="text-sm font-extrabold text-slate-900">Veterinary & Medication Instructions</h4>
                </div>
                <p className="text-xs text-stone-600">
                  Please provide exact medication dosage, timing, and supervising veterinarian clinic contact.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Medication Name"
                    placeholder="e.g. Posatex, Amoxicillin, Eye drops"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                  />
                  <Input
                    label="Dosage"
                    placeholder="e.g. 1 tablet, 4 drops in ear"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                  />
                  <Input
                    label="Frequency / Timing"
                    placeholder="e.g. Every 12 hours with meal"
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value)}
                  />
                  <Input
                    label="Supervising Vet Doctor / Clinic"
                    placeholder="e.g. Dr. Clara Vance (Mission Pet Hospital)"
                    value={medVetName}
                    onChange={(e) => setMedVetName(e.target.value)}
                  />
                </div>

                <Input
                  label="Emergency Vet Phone Number"
                  placeholder="e.g. (415) 555-3829"
                  value={medVetPhone}
                  onChange={(e) => setMedVetPhone(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-bold text-slate-800 tracking-tight mb-1.5">
                    Administration Notes & Feeding Preferences
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Wrap in salmon paste treat; massage base of ear for 15 seconds."
                    value={medInstructions}
                    onChange={(e) => setMedInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-rose-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 outline-none resize-none shadow-soft-sm"
                  />
                </div>
              </Card>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 tracking-tight mb-1.5">
                Special Instructions & Pet Routines
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Please bring extra poop bags and keep on 6ft leash at all times."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200/90 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none resize-none shadow-soft-sm"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button size="lg" onClick={() => setStep(4)}>
              Review Request <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Post */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <h3 className="text-base font-extrabold text-slate-900">Review and Submit Your Request</h3>

          <Card className="p-6 space-y-5 border-teal-200/80 bg-gradient-to-br from-white to-teal-50/20 rounded-3xl shadow-soft-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedPet?.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop'}
                  alt={selectedPet?.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-700 shadow-soft-sm"
                />
                <div>
                  <h4 className="text-base font-black text-slate-900">{title}</h4>
                  <p className="text-xs text-teal-800 font-bold">
                    {selectedPet?.name} ({selectedPet?.breed || selectedPet?.species})
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-400 block uppercase font-bold">Budget</span>
                <span className="text-2xl font-black text-slate-900">${parseFloat(budget).toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-3 bg-white rounded-xl border border-stone-100">
                <span className="text-stone-400 block font-semibold mb-0.5">Category</span>
                <span className="font-extrabold text-slate-900">{selectedService.category.replace('_', ' ')}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-100">
                <span className="text-stone-400 block font-semibold mb-0.5">Service</span>
                <span className="font-extrabold text-slate-900">{selectedService.label}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-100">
                <span className="text-stone-400 block font-semibold mb-0.5">Schedule</span>
                <span className="font-extrabold text-slate-900">{scheduledDate} @ {startTime}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-100 col-span-2 sm:col-span-3">
                <span className="text-stone-400 block font-semibold mb-0.5">Location</span>
                <span className="font-extrabold text-slate-900">{location}</span>
              </div>
            </div>

            {isMedicalService && medName && (
              <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 text-xs space-y-1">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-rose-600" />
                  <span>Medication: {medName} ({medDosage})</span>
                </div>
                <p className="text-rose-800 text-[11px]">
                  Frequency: {medFrequency || 'As directed'} • Vet: {medVetName || 'On file'}
                </p>
              </div>
            )}

            {description && (
              <div className="p-3.5 bg-white rounded-xl border border-stone-100 text-xs">
                <span className="text-stone-400 block font-semibold mb-0.5">Instructions</span>
                <p className="text-stone-700 leading-relaxed">{description}</p>
              </div>
            )}
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button size="lg" isLoading={isLoading} onClick={handleSubmit}>
              Post Request to Nearby Helpers 🐾
            </Button>
          </div>
        </div>
      )}

      {/* Success Confirmation Modal */}
      {createdRequestData && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            router.push('/dashboard/owner/requests');
          }}
          title="Care Request Posted Successfully!"
          maxWidth="md"
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">{createdRequestData.title}</h3>
              <p className="text-xs text-stone-500 mt-1">
                Request ID: <span className="font-mono text-stone-700 font-bold">{createdRequestData.id}</span>
              </p>
            </div>

            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-semibold">Status:</span>
                <span className="px-2 py-0.5 bg-teal-200/80 text-teal-900 rounded-full font-black text-[10px]">
                  OPEN • Dispatching to nearby helpers
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-semibold">Budget:</span>
                <span className="font-black text-slate-900">${createdRequestData.budget?.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-semibold">Location:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{createdRequestData.location}</span>
              </div>
            </div>

            <p className="text-xs text-stone-500">
              Nearby verified helpers within your area are being notified now. You will receive offers directly on your request board.
            </p>

            <div className="flex gap-3 pt-3">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/dashboard/owner/requests');
                }}
              >
                Track in My Requests
              </Button>
              <Button
                className="w-full text-xs"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push(`/dashboard/owner/requests?requestId=${createdRequestData.id}`);
                }}
              >
                View Matches 🎯
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <AddPetModal
        isOpen={isAddPetOpen}
        onClose={() => setIsAddPetOpen(false)}
        onPetAdded={(newPet) => {
          setPets([newPet, ...pets]);
          setSelectedPetId(newPet.id);
        }}
      />
    </div>
  );
}

export default function CreateRequestPage() {
  return (
    <React.Suspense
      fallback={
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <CreateRequestContent />
    </React.Suspense>
  );
}
