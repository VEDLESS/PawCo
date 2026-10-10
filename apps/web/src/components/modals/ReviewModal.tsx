'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RatingStars } from '../common/RatingStars';
import { api } from '@/lib/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  targetName: string;
  onReviewSubmitted: () => void;
}

export const ReviewModal = ({
  isOpen,
  onClose,
  bookingId,
  targetName,
  onReviewSubmitted,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await api.post('/reviews', {
      bookingId,
      rating,
      comment: comment || null,
    });

    setIsLoading(false);
    if (res.success) {
      onReviewSubmitted();
      onClose();
    } else {
      setError(res.error || 'Failed to submit review');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rate & Review ${targetName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <div className="text-center py-4 bg-ivory-50/70 rounded-2xl border border-stone-200">
          <p className="text-xs font-semibold text-stone-500 mb-2">Select Your Rating</p>
          <div className="flex justify-center">
            <RatingStars
              rating={rating}
              size="lg"
              interactive={true}
              onRatingChange={(newRating) => setRating(newRating)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 tracking-wide mb-1.5">
            Your Feedback (Optional)
          </label>
          <textarea
            rows={3}
            placeholder={`How was your experience with ${targetName}?`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:ring-2 focus:ring-forest-500/20 focus:border-forest-600 outline-none resize-none transition-all shadow-soft-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="forest" isLoading={isLoading} className="shadow-soft-sm">
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
