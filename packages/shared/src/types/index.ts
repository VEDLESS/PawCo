export enum Role {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER', // Compatible alias with CUSTOMER
  HELPER = 'HELPER',
  ADMIN = 'ADMIN',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum ServiceCategory {
  BASIC_CARE = 'BASIC_CARE',
  MEDICAL_HEALTH = 'MEDICAL_HEALTH',
  TRANSPORTATION = 'TRANSPORTATION',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum ServiceType {
  // Basic Care
  DOG_WALKING = 'DOG_WALKING',
  PET_SITTING = 'PET_SITTING',
  FEEDING = 'FEEDING',
  GROOMING = 'GROOMING',
  BATHING = 'BATHING',
  PET_BOARDING = 'PET_BOARDING',

  // Medical / Health
  VET_CONSULTATION = 'VET_CONSULTATION',
  VET_VISIT_ASSISTANCE = 'VET_VISIT_ASSISTANCE',
  MEDICINE_PICKUP = 'MEDICINE_PICKUP',
  MEDICINE_ADMINISTRATION = 'MEDICINE_ADMINISTRATION',
  POST_SURGERY_CARE = 'POST_SURGERY_CARE',
  HEALTH_CHECK_ASSISTANCE = 'HEALTH_CHECK_ASSISTANCE',

  // Transportation
  VET_TRANSPORTATION = 'VET_TRANSPORTATION',
  PET_PICKUP_DROP = 'PET_PICKUP_DROP',
  EMERGENCY_TRANSPORTATION = 'EMERGENCY_TRANSPORTATION',

  // Emergency
  EMERGENCY_VET_ASSISTANCE = 'EMERGENCY_VET_ASSISTANCE',
  EMERGENCY_CHECK_IN = 'EMERGENCY_CHECK_IN',
  LOST_PET_ASSISTANCE = 'LOST_PET_ASSISTANCE',

  // Other
  CUSTOM_REQUEST = 'CUSTOM_REQUEST',
  OTHER = 'OTHER',
}

export enum RequestStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  ACCEPTED = 'ACCEPTED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  DISPUTED = 'DISPUTED',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  HELPER_ON_THE_WAY = 'HELPER_ON_THE_WAY',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CUSTOMER_CONFIRMED = 'CUSTOMER_CONFIRMED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export enum ReportStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum ReportReason {
  INAPPROPRIATE_BEHAVIOR = 'INAPPROPRIATE_BEHAVIOR',
  FRAUD = 'FRAUD',
  UNSAFE_BEHAVIOR = 'UNSAFE_BEHAVIOR',
  FAKE_PROFILE = 'FAKE_PROFILE',
  OTHER = 'OTHER',
}

export enum NotificationType {
  REQUEST_CREATED = 'REQUEST_CREATED',
  REQUEST_ACCEPTED = 'REQUEST_ACCEPTED',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  HELPER_ON_THE_WAY = 'HELPER_ON_THE_WAY',
  BOOKING_IN_PROGRESS = 'BOOKING_IN_PROGRESS',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  CUSTOMER_CONFIRMED = 'CUSTOMER_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_DISPUTED = 'BOOKING_DISPUTED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_REVIEW = 'NEW_REVIEW',
  EMERGENCY_ALERT = 'EMERGENCY_ALERT',
  VERIFICATION_UPDATE = 'VERIFICATION_UPDATE',
  SYSTEM = 'SYSTEM',
}

export interface MedicineDetails {
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  instructions?: string;
  prescriptionUrl?: string;
  vetName?: string;
  vetPhone?: string;
}

export interface HelperServicePricing {
  serviceType: ServiceType;
  rate: number;
  rateUnit: 'hour' | 'day' | 'visit' | 'flat';
}

export interface HelperWorkingHours {
  day: string; // e.g., 'Monday', 'Tuesday'
  enabled: boolean;
  startTime: string; // e.g., '08:00'
  endTime: string; // e.g., '18:00'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  profileImage?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isSuspended?: boolean;
  onboardingNeeds?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
  helperProfile?: HelperProfile | null;
}

export interface HelperProfile {
  id: string;
  userId: string;
  bio?: string | null;
  experience?: string | null;
  skills?: string[];
  hourlyRate: number;
  serviceRadius: number; // in kilometers
  services: ServiceType[];
  pricing?: Record<string, number> | any;
  workingDays?: string[];
  workingHours?: HelperWorkingHours[];
  maxBookingsPerDay?: number;
  isAvailable: boolean;
  verificationStatus: VerificationStatus;
  governmentIdUrl?: string | null;
  certificationUrl?: string | null;
  rating: number;
  totalReviews: number;
  user?: User;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  gender?: string | null;
  weight?: number | null;
  description?: string | null;
  medicalConditions?: string | null;
  allergies?: string | null;
  vaccinations?: string | null;
  medications?: string | null;
  specialInstructions?: string | null;
  behaviorNotes?: string | null;
  emergencyNotes?: string | null;
  image?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ServiceRequest {
  id: string;
  ownerId: string;
  petId: string;
  category: ServiceCategory;
  serviceType: ServiceType;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  scheduledDate: string | Date;
  startTime: string;
  endTime?: string | null;
  budget: number;
  isEmergency?: boolean;
  medicineDetails?: MedicineDetails | null;
  customFields?: Record<string, any> | null;
  status: RequestStatus;
  pet?: Pet;
  owner?: User;
  bookings?: Booking[];
  offers?: HelperOffer[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface HelperOffer {
  id: string;
  requestId: string;
  helperId: string;
  offeredPrice: number;
  proposedTime?: string | null;
  note?: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  helper?: User;
  createdAt: string | Date;
}

export interface Booking {
  id: string;
  requestId: string;
  ownerId: string;
  helperId: string;
  agreedPrice: number;
  status: BookingStatus;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  request?: ServiceRequest;
  owner?: User;
  helper?: User;
  reviews?: Review[];
  messages?: Message[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  comment?: string | null;
  serviceFeedback?: string | null;
  reviewer?: User;
  createdAt: string | Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  bookingId: string;
  message: string;
  imageUrl?: string | null;
  readAt?: string | Date | null;
  sender?: User;
  receiver?: User;
  createdAt: string | Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  resolutionNotes?: string | null;
  reporter?: User;
  reportedUser?: User;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: Record<string, any> | null;
  admin?: User;
  createdAt: string | Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any> | null;
  read: boolean;
  createdAt: string | Date;
}

export interface MatchScoredHelper {
  helper: HelperProfile;
  distanceKm: number;
  matchScore: number; // 0-100 calculated by Smart Matching Engine
  reasons: string[];
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
