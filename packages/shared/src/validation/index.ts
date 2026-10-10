import { z } from 'zod';
import {
  Role,
  ServiceCategory,
  ServiceType,
  RequestStatus,
  BookingStatus,
  VerificationStatus,
  ReportReason,
  ReportStatus,
} from '../types';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).default(Role.CUSTOMER),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  onboardingNeeds: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  profileImage: z.string().url().optional().nullable(),
  location: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  onboardingNeeds: z.array(z.string()).optional(),
});

export const helperProfileSchema = z.object({
  bio: z.string().max(1000).optional().nullable(),
  experience: z.string().max(500).optional().nullable(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  serviceRadius: z.number().min(1, 'Service radius must be at least 1 km').max(100),
  services: z.array(z.nativeEnum(ServiceType)).min(1, 'Select at least one service'),
  pricing: z.record(z.string(), z.number()).optional(),
  workingDays: z.array(z.string()).optional(),
  workingHours: z.array(z.any()).optional(),
  maxBookingsPerDay: z.number().min(1).max(20).optional(),
  isAvailable: z.boolean().default(true),
  governmentIdUrl: z.string().optional().nullable(),
  certificationUrl: z.string().optional().nullable(),
});

export const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  species: z.string().min(1, 'Species is required (e.g. Dog, Cat, Bird)'),
  breed: z.string().optional().nullable(),
  age: z.number().min(0).max(50).optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Other']).optional().nullable(),
  weight: z.number().min(0).optional().nullable(),
  description: z.string().optional().nullable(),
  medicalConditions: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  vaccinations: z.string().optional().nullable(),
  medications: z.string().optional().nullable(),
  specialInstructions: z.string().optional().nullable(),
  behaviorNotes: z.string().optional().nullable(),
  emergencyNotes: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const medicineDetailsSchema = z.object({
  medicineName: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g. 1 tablet, 5ml)'),
  frequency: z.string().min(1, 'Frequency is required (e.g. Every 8 hours)'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  instructions: z.string().optional(),
  prescriptionUrl: z.string().optional(),
  vetName: z.string().optional(),
  vetPhone: z.string().optional(),
});

export const serviceRequestSchema = z.object({
  petId: z.string().uuid('Invalid pet ID'),
  category: z.nativeEnum(ServiceCategory).default(ServiceCategory.BASIC_CARE),
  serviceType: z.nativeEnum(ServiceType),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Please provide a clear description'),
  location: z.string().min(2, 'Location address is required'),
  latitude: z.number({ required_error: 'Latitude is required' }),
  longitude: z.number({ required_error: 'Longitude is required' }),
  scheduledDate: z.string().or(z.date()),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)').optional().nullable(),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  isEmergency: z.boolean().default(false),
  medicineDetails: medicineDetailsSchema.optional().nullable(),
  customFields: z.record(z.string(), z.any()).optional().nullable(),
});

export const updateRequestStatusSchema = z.object({
  status: z.nativeEnum(RequestStatus),
});

export const createBookingSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
  helperId: z.string().uuid('Invalid helper ID'),
  agreedPrice: z.number().min(1, 'Agreed price must be greater than 0'),
});

export const createOfferSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
  offeredPrice: z.number().min(1, 'Offered price must be positive'),
  proposedTime: z.string().optional(),
  note: z.string().max(500).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export const reviewSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(1000).optional().nullable(),
  serviceFeedback: z.string().max(500).optional().nullable(),
});

export const messageSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  receiverId: z.string().uuid('Invalid receiver ID'),
  message: z.string().min(1, 'Message cannot be empty').max(2000),
  imageUrl: z.string().url().optional().nullable(),
});

export const createReportSchema = z.object({
  reportedUserId: z.string().uuid('Invalid user ID'),
  reason: z.nativeEnum(ReportReason),
  description: z.string().min(10, 'Please provide detailed report reasons'),
});

export const resolveReportSchema = z.object({
  status: z.nativeEnum(ReportStatus),
  resolutionNotes: z.string().optional(),
});

export const nearbyHelperQuerySchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  radiusKm: z.coerce.number().default(15),
  serviceType: z.nativeEnum(ServiceType).optional(),
  category: z.nativeEnum(ServiceCategory).optional(),
  isEmergency: z.coerce.boolean().optional(),
});
