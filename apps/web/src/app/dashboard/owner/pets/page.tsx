'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Pet } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AddPetModal } from '@/components/modals/AddPetModal';
import { Dog, PlusCircle, Trash2, Heart, Shield, Stethoscope, AlertTriangle, Pill, PhoneCall } from 'lucide-react';

export default function MyPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchPets = async () => {
    setIsLoading(true);
    const res = await api.get<Pet[]>('/pets');
    if (res.success && res.data) setPets(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDeletePet = async (petId: string) => {
    if (confirm('Are you sure you want to remove this pet profile?')) {
      const res = await api.delete(`/pets/${petId}`);
      if (res.success) {
        setPets(pets.filter((p) => p.id !== petId));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-forest-950 tracking-tight">My Pets & Care Profiles</h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage your beloved companions, health profiles, medications, and instructions.</p>
        </div>
        <Button variant="forest" onClick={() => setIsAddOpen(true)} className="shadow-soft-sm">
          <PlusCircle className="w-4 h-4" /> Add New Pet
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-9 h-9 border-3 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : pets.length === 0 ? (
        <Card className="p-12 text-center space-y-3.5 bg-ivory-50/50 border-stone-200">
          <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto shadow-inner">
            <Dog className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-forest-950">No Pets Registered</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Add your furry or feathered friends to schedule walks, sitting, veterinary, and medical care appointments.
          </p>
          <Button size="sm" variant="forest" onClick={() => setIsAddOpen(true)}>
            Add Pet Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="p-6 space-y-4 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={pet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop'}
                    alt={pet.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-forest-500/30 shadow-soft-sm"
                  />
                  <div>
                    <h3 className="text-lg font-extrabold text-forest-950">{pet.name}</h3>
                    <p className="text-xs text-stone-500">{pet.breed || pet.species}</p>
                    <span className="text-xs font-semibold text-forest-700 mt-1 inline-block">
                      {pet.age ? `${pet.age} Years Old` : 'Age N/A'} • {pet.gender || 'Unknown'} {pet.weight ? `• ${pet.weight} kg` : ''}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeletePet(pet.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Pet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {pet.description && (
                <div className="text-xs text-stone-600 bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                  <span className="font-bold text-forest-950 block mb-0.5">About {pet.name}:</span>
                  {pet.description}
                </div>
              )}

              {/* Medical & Special Care Details */}
              {(pet.medicalConditions || pet.allergies || pet.medications || pet.vaccinations) && (
                <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200/70 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-950">
                    <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                    <span>Health & Medical Profile</span>
                  </div>
                  {pet.medicalConditions && (
                    <p className="text-rose-900 text-[11px]"><span className="font-semibold text-rose-950">Conditions:</span> {pet.medicalConditions}</p>
                  )}
                  {pet.medications && (
                    <p className="text-rose-900 text-[11px]"><span className="font-semibold text-rose-950">Medications:</span> {pet.medications}</p>
                  )}
                  {pet.allergies && (
                    <p className="text-rose-900 text-[11px]"><span className="font-semibold text-rose-950">Allergies:</span> {pet.allergies}</p>
                  )}
                  {pet.vaccinations && (
                    <p className="text-rose-900 text-[11px]"><span className="font-semibold text-rose-950">Vaccinations:</span> {pet.vaccinations}</p>
                  )}
                </div>
              )}

              {pet.emergencyNotes && (
                <div className="text-xs text-amber-900 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-0.5">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                    <span>Emergency Vet Contact</span>
                  </div>
                  <p className="text-[11px] text-amber-900">{pet.emergencyNotes}</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <Link href={`/dashboard/owner/requests/new?petId=${pet.id}`} className="w-full">
                  <Button size="sm" variant="forest" className="w-full text-xs shadow-soft-sm">
                    Request Care for {pet.name}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddPetModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onPetAdded={(newPet) => setPets([newPet, ...pets])}
      />
    </div>
  );
}
