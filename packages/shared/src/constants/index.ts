export const SERVICE_CATEGORIES = [
  {
    id: 'BASIC_CARE',
    name: 'Basic Pet Care',
    description: 'Daily essential care, walking, sitting, bathing, and boarding.',
    icon: 'Heart',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'MEDICAL_HEALTH',
    name: 'Medical & Veterinary Health',
    description: 'Medication administration, vet visits, post-surgery care, and health check-ins.',
    icon: 'Pill',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'TRANSPORTATION',
    name: 'Pet Transportation',
    description: 'Safe, stress-free transit to vets, appointments, or home drop-offs.',
    icon: 'Car',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'EMERGENCY',
    name: 'Emergency Assistance',
    description: 'Urgent emergency vet accompaniment, rapid wellness check-ins, or lost pet alerts.',
    icon: 'AlertCircle',
    color: 'from-amber-500 to-red-600',
  },
  {
    id: 'OTHER',
    name: 'Custom Requests',
    description: 'Specialized requirements tailored to your pet’s exact routine.',
    icon: 'Sparkles',
    color: 'from-purple-500 to-violet-600',
  },
];

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  // Basic Care
  DOG_WALKING: 'Dog Walking',
  PET_SITTING: 'Pet Sitting',
  FEEDING: 'Feeding & Care',
  GROOMING: 'Pet Grooming',
  BATHING: 'Pet Bathing',
  PET_BOARDING: 'Pet Boarding',

  // Medical / Health
  VET_CONSULTATION: 'Vet Consultation',
  VET_VISIT_ASSISTANCE: 'Vet Visit Assistance',
  MEDICINE_PICKUP: 'Medicine Pickup',
  MEDICINE_ADMINISTRATION: 'Medicine Administration',
  POST_SURGERY_CARE: 'Post-Surgery Care',
  HEALTH_CHECK_ASSISTANCE: 'Health Check Assistance',

  // Transportation
  VET_TRANSPORTATION: 'Vet Transportation',
  PET_PICKUP_DROP: 'Pet Pickup & Drop',
  EMERGENCY_TRANSPORTATION: 'Emergency Pet Transit',

  // Emergency
  EMERGENCY_VET_ASSISTANCE: 'Emergency Vet Assistance',
  EMERGENCY_CHECK_IN: 'Emergency Check-in',
  LOST_PET_ASSISTANCE: 'Lost Pet Search Alert',

  // Other
  CUSTOM_REQUEST: 'Custom Pet Care Request',
  OTHER: 'Other Care Service',
};

export const DEFAULT_SEARCH_RADIUS_KM = 15;
export const MAX_SEARCH_RADIUS_KM = 50;

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  NEW_MESSAGE: 'new_message',
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_READ: 'message_read',
  REQUEST_CREATED: 'request_created',
  REQUEST_ACCEPTED: 'request_accepted',
  REQUEST_UPDATED: 'request_updated',
  OFFER_CREATED: 'offer_created',
  BOOKING_STATUS_CHANGED: 'booking_status_changed',
  HELPER_LOCATION_UPDATE: 'helper_location_update',
  NOTIFICATION: 'notification',
  ADMIN_LIVE_ACTIVITY: 'admin_live_activity',
  EMERGENCY_ALERT: 'emergency_alert',
} as const;
