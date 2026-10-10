'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/common/RatingStars';
import {
  PawPrint,
  ShieldCheck,
  MapPin,
  Clock,
  Heart,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Footprints,
  Home,
  Utensils,
  Scissors,
  Bed,
  Pill,
  Smartphone,
  Globe,
  Car,
  Stethoscope,
  ShieldAlert,
  Star,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const handleProtectedAction = (destination: string, mode: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    if (user) {
      router.push(destination);
    } else {
      openAuthModal(mode, () => router.push(destination));
    }
  };

  const serviceCategories = [
    {
      title: 'Dog Walking & Park Runs',
      desc: 'GPS tracked neighborhood walks, vigorous exercise, and refreshing hydration.',
      icon: Footprints,
      badge: 'From $25/walk',
      tag: 'Basic Care',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'In-Home Pet Sitting',
      desc: 'Caring companionship, gentle feeding routines, and overnight house sitting.',
      icon: Home,
      badge: 'From $50/day',
      tag: 'Basic Care',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      title: 'Medicine Administration',
      desc: 'Vet-certified assistance for ear drops, oral tablets, insulin, and post-op care.',
      icon: Pill,
      badge: 'From $35/visit',
      tag: 'Medical & Health',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      title: 'Veterinary Transportation',
      desc: 'Harnessed or carrier transit directly to vet clinics and return home drop-offs.',
      icon: Car,
      badge: 'From $35/trip',
      tag: 'Transit',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: 'Home Boarding',
      desc: 'Cage-free, loving stays in verified helper homes with fenced backyards.',
      icon: Bed,
      badge: 'From $65/night',
      tag: 'Overnight',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: '🚨 Emergency Vet Assistance',
      desc: 'Rapid accompaniment and dispatch to 24/7 animal emergency hospitals.',
      icon: ShieldAlert,
      badge: 'Immediate Dispatch',
      tag: 'Emergency',
      color: 'bg-red-50 text-red-800 border-red-200',
    },
  ];

  const featuredHelpers = [
    {
      name: 'Maya Chen',
      role: 'Certified Vet Tech Assistant',
      rating: 5.0,
      reviews: 31,
      rate: '$40/hr',
      distance: '1.2 km away',
      specialty: 'Oral/Injectable Meds & Post-Op Recovery',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      verified: true,
    },
    {
      name: 'Alex Rivera',
      role: 'Professional Walker & CPR Certified',
      rating: 4.95,
      reviews: 42,
      rate: '$30/hr',
      distance: '2.1 km away',
      specialty: 'Pack Walks, Large Breeds & Leash Manners',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      verified: true,
    },
    {
      name: 'Lucas Wright',
      role: 'Home Boarder & Backyard Host',
      rating: 4.8,
      reviews: 19,
      rate: '$28/hr',
      distance: '2.8 km away',
      specialty: 'Fenced Yard Boarding & Socialization',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
      verified: true,
    },
  ];

  const testimonials = [
    {
      quote:
        'Finding Maya for Bruno was a lifesaver! Bruno needed twice-daily hip supplements and gentle walks. She sent photos every hour and followed instructions to the letter.',
      author: 'Sarah Jenkins',
      pet: 'Mom to Bruno (Golden Retriever)',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
    },
    {
      quote:
        'When Rocky had an urgent allergic reaction on a Saturday evening, PawCo connected me with an emergency transit helper within 10 minutes. Invaluable community support.',
      author: 'David Miller',
      pet: 'Dad to Rocky (French Bulldog)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfaf8]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-stone-200/60 bg-gradient-to-b from-stone-50/80 via-[#fbfaf8] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-extrabold shadow-soft-sm">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>Hyperlocal Neighborhood Pet Care Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                Loving, Verified Pet Care{' '}
                <span className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700 bg-clip-text text-transparent">
                  Right Next Door
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                Connect with background-checked neighborhood helpers for daily dog walks, cozy in-home sitting, prescription medication support, and rapid vet clinic transport.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <Button
                  size="lg"
                  className="w-full sm:w-auto shadow-md shadow-teal-900/15"
                  onClick={() => handleProtectedAction('/dashboard/owner/requests/new')}
                >
                  Request Care for Your Pet
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => handleProtectedAction('/dashboard/helper/profile', 'REGISTER')}
                >
                  Become a Verified Helper
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">100% ID Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-700 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">15-Min Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">CPR & First Aid Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Hero Pet Image Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border border-stone-200/80 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=700&fit=crop"
                    alt="Happy pets outdoors"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-soft-xl border border-stone-200/80 flex items-center gap-3.5 animate-in fade-in zoom-in-95 backdrop-blur-sm">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg shadow-inner">
                    ★
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-900 block leading-tight">4.96 / 5.0 Rating</span>
                    <span className="text-[11px] text-stone-500 font-semibold block mt-0.5">Over 1,200+ verified pet bookings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-20 bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold tracking-widest text-teal-700 uppercase">
              Comprehensive Care Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tailored Pet Services for Every Routine
            </h2>
            <p className="text-sm text-stone-600">
              From energetic puppy walks to specialized veterinary drop administration, our verified helpers have your pets covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Card
                  key={idx}
                  hoverable
                  className="p-6 flex flex-col justify-between space-y-4 rounded-3xl border-stone-200/80 bg-[#fdfbf7]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/60 text-teal-800 flex items-center justify-center shadow-soft-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${s.color}`}>
                        {s.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900">{s.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
                  </div>

                  <button
                    onClick={() => handleProtectedAction('/dashboard/owner/requests/new')}
                    className="pt-2 text-left focus:outline-none"
                  >
                    <span className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
                      Request this service <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Helpers Section */}
      <section id="helpers" className="py-20 bg-[#fbfaf8] border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold tracking-widest text-teal-700 uppercase">
                Neighborhood Providers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Meet Five-Star Helpers Near You
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Background-checked, identity verified, and trusted by pet parents across San Francisco.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleProtectedAction('/dashboard/owner/helpers')}
            >
              Browse All Helpers <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredHelpers.map((h, idx) => (
              <Card key={idx} hoverable className="p-6 space-y-5 rounded-3xl bg-white border-stone-200/80">
                <div className="flex items-center gap-4">
                  <img
                    src={h.image}
                    alt={h.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-600/20 shadow-soft-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">{h.name}</h4>
                      {h.verified && (
                        <span title="Verified Helper">
                          <ShieldCheck className="w-4 h-4 text-teal-700" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">{h.role}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
                      <span>★ {h.rating.toFixed(2)}</span>
                      <span className="text-stone-400">({h.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#fdfbf7] rounded-2xl border border-stone-200/60 text-xs space-y-1">
                  <p className="text-stone-500 font-semibold">Specialty:</p>
                  <p className="font-bold text-slate-800">{h.specialty}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-400 font-semibold block text-[11px]">Hourly Rate</span>
                    <span className="font-black text-slate-900 text-base">{h.rate}</span>
                  </div>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => handleProtectedAction('/dashboard/owner/requests/new')}
                  >
                    Book {h.name.split(' ')[0]}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-extrabold tracking-widest text-teal-700 uppercase">
              Pet Parent Stories
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Loved by Pets, Trusted by Owners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="p-8 space-y-5 rounded-3xl bg-[#fdfbf7] border-stone-200/80">
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3.5 pt-3 border-t border-stone-200/60">
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-soft-sm"
                  />
                  <div>
                    <h5 className="text-sm font-extrabold text-slate-900">{t.author}</h5>
                    <p className="text-xs text-teal-800 font-semibold">{t.pet}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
