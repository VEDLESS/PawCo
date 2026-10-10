'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { HelperProfile, ServiceType } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RatingStars } from '@/components/common/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Compass, Search, MapPin, DollarSign, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function FindHelpersPage() {
  const [helpers, setHelpers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string>('');

  const fetchHelpers = async () => {
    setIsLoading(true);
    // Fetch nearby or searched helpers
    const res = await api.get<any[]>('/helpers/nearby?latitude=37.7749&longitude=-122.4194&radiusKm=25');
    if (res.success && res.data) {
      setHelpers(res.data);
    } else {
      // Fallback search
      const fallback = await api.get<any[]>('/helpers/search');
      if (fallback.success && fallback.data) setHelpers(fallback.data.map((h: any) => ({ helper: h, distanceKm: 2.4 })));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHelpers();
  }, []);

  const filteredHelpers = helpers.filter((item) => {
    const h = item.helper || item;
    const nameMatch = h.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.user?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const serviceMatch = selectedService ? h.services?.includes(selectedService) : true;
    return nameMatch && serviceMatch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Find Neighborhood Pet Helpers</h1>
        <p className="text-xs text-slate-500">Discover verified, background-checked pet lovers near your location.</p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by helper name or neighborhood..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
          >
            <option value="">All Services</option>
            <option value="DOG_WALKING">Dog Walking</option>
            <option value="PET_SITTING">Pet Sitting</option>
            <option value="FEEDING">Feeding & Care</option>
            <option value="MEDICATION_ASSISTANCE">Medication Assistance</option>
            <option value="PET_BOARDING">Pet Boarding</option>
            <option value="GROOMING">Pet Grooming</option>
          </select>
        </div>
      </div>

      {/* Helpers Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredHelpers.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No helpers matched your filters</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or selecting All Services.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHelpers.map((item, idx) => {
            const helper = item.helper || item;
            const distance = item.distanceKm;

            return (
              <Card key={idx} hoverable className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={helper.user?.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'}
                      alt={helper.user?.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-slate-900">{helper.user?.name}</h3>
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                      </div>
                      <p className="text-xs text-slate-500">{helper.user?.location || 'San Francisco, CA'}</p>
                      <div className="mt-1">
                        <RatingStars rating={helper.rating || 5.0} totalReviews={helper.totalReviews || 12} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900">${helper.hourlyRate || 25}/hr</span>
                    {distance !== undefined && (
                      <span className="text-[11px] block text-teal-700 font-semibold">{distance} km away</span>
                    )}
                  </div>
                </div>

                {helper.bio && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{helper.bio}</p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  {helper.services?.map((svc: string, i: number) => (
                    <Badge key={i} variant="neutral" size="sm">
                      {svc.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href="/dashboard/owner/requests/new">
                    <Button size="sm" className="w-full text-xs">
                      Book {helper.user?.name?.split(' ')[0]} for Pet Care
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
