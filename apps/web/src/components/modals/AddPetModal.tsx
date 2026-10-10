'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { api } from '@/lib/api';
import { Pet } from '@petco/shared';
import { Dog, Heart, ShieldAlert, Sparkles, Stethoscope } from 'lucide-react';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetAdded: (newPet: Pet) => void;
}

export const AddPetModal = ({ isOpen, onClose, onPetAdded }: AddPetModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    description: '',
    medicalConditions: '',
    allergies: '',
    vaccinations: '',
    medications: '',
    specialInstructions: '',
    behaviorNotes: '',
    emergencyNotes: '',
    image: '',
  });
  const [activeTab, setActiveTab] = useState<'basics' | 'medical'>('basics');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed || null,
      age: formData.age ? parseInt(formData.age, 10) : null,
      gender: formData.gender,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      description: formData.description || null,
      medicalConditions: formData.medicalConditions || null,
      allergies: formData.allergies || null,
      vaccinations: formData.vaccinations || null,
      medications: formData.medications || null,
      specialInstructions: formData.specialInstructions || null,
      behaviorNotes: formData.behaviorNotes || null,
      emergencyNotes: formData.emergencyNotes || null,
      image: formData.image || (formData.species === 'Cat' 
        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop'),
    };

    const res = await api.post<Pet>('/pets', payload);
    setIsLoading(false);

    if (res.success && res.data) {
      onPetAdded(res.data);
      onClose();
      setFormData({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        weight: '',
        description: '',
        medicalConditions: '',
        allergies: '',
        vaccinations: '',
        medications: '',
        specialInstructions: '',
        behaviorNotes: '',
        emergencyNotes: '',
        image: '',
      });
      setActiveTab('basics');
    } else {
      setError(res.error || 'Failed to add pet');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Your Pet Profile" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {/* Modal Section Tabs */}
        <div className="flex gap-2 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'basics' ? 'bg-white text-forest-950 shadow-soft-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Dog className="w-3.5 h-3.5" /> Basic Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('medical')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'medical' ? 'bg-white text-forest-950 shadow-soft-sm' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-rose-500" /> Health & Special Care
          </button>
        </div>

        {activeTab === 'basics' ? (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Pet Name *"
                required
                placeholder="e.g. Bruno, Bella"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                  Species *
                </label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                >
                  <option value="Dog">Dog 🐕</option>
                  <option value="Cat">Cat 🐈</option>
                  <option value="Bird">Bird 🦜</option>
                  <option value="Rabbit">Rabbit 🐇</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input
                label="Breed"
                placeholder="e.g. Golden Retriever, French Bulldog"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <Input
                label="Age (Years)"
                type="number"
                min="0"
                placeholder="e.g. 4"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />

              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 28"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                About & Temperament
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Playful, friendly with other dogs, loves tennis balls and gentle belly rubs."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Special Instructions & Handling Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Do not let him run excessively on concrete; keep on 6ft leash."
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Helpers use these medical notes to ensure safe care and proper medication administration.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Medical Conditions"
                placeholder="e.g. Hip dysplasia, Diabetes, Sensitive stomach"
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              />

              <Input
                label="Allergies (Food / Environmental)"
                placeholder="e.g. Chicken kibble, Grass pollen"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />

              <Input
                label="Vaccination Status"
                placeholder="e.g. Rabies, DHPP, Bordetella up to date"
                value={formData.vaccinations}
                onChange={(e) => setFormData({ ...formData, vaccinations: e.target.value })}
              />

              <Input
                label="Current Medications"
                placeholder="e.g. Joint supplement daily, Ear drops"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Behavior & Trigger Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Timid around thunder or vacuum cleaners; gets overly excited around squirrels."
                value={formData.behaviorNotes}
                onChange={(e) => setFormData({ ...formData, behaviorNotes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Emergency Vet Contact & Insurance Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Mission Pet Hospital (415) 555-3829. Insurance Policy #PET-482019"
                value={formData.emergencyNotes}
                onChange={(e) => setFormData({ ...formData, emergencyNotes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none resize-none"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-3 pt-3 border-t border-slate-100">
          {activeTab === 'basics' ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('medical')}
              className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              Add Medical / Health Info →
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('basics')}
              className="text-xs"
            >
              ← Back to Basics
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="forest" isLoading={isLoading} className="shadow-soft-sm">
              Save Pet Profile
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
