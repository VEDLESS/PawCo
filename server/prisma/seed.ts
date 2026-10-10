import { PrismaClient, Role, VerificationStatus, ServiceCategory, ServiceType, RequestStatus, BookingStatus, NotificationType, ReportStatus, ReportReason } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PetCo database with 3-Role Ecosystem Data...');

  // Clean existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.helperOffer.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.helperProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Admin Account
  const admin = await prisma.user.create({
    data: {
      name: 'PetCo Administrator',
      email: 'admin@petco.com',
      passwordHash: defaultPassword,
      role: Role.ADMIN,
      phone: '+1-555-0100',
      location: 'San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
  });

  // 2. Pet Owners (Customers)
  const owner1 = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'sarah@petco.com',
      passwordHash: defaultPassword,
      role: Role.CUSTOMER,
      phone: '+1-555-0101',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      location: 'Mission District, San Francisco, CA',
      latitude: 37.7599,
      longitude: -122.4148,
      onboardingNeeds: ['DOG_WALKING', 'MEDICINE_ADMINISTRATION', 'FEEDING'],
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'David Miller',
      email: 'david@petco.com',
      passwordHash: defaultPassword,
      role: Role.CUSTOMER,
      phone: '+1-555-0102',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      location: 'SoMa, San Francisco, CA',
      latitude: 37.7785,
      longitude: -122.3950,
      onboardingNeeds: ['PET_SITTING', 'EMERGENCY_VET_ASSISTANCE'],
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      name: 'Emma Watson',
      email: 'emma@petco.com',
      passwordHash: defaultPassword,
      role: Role.CUSTOMER,
      phone: '+1-555-0103',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      location: 'Pacific Heights, San Francisco, CA',
      latitude: 37.7925,
      longitude: -122.4382,
      onboardingNeeds: ['MEDICINE_ADMINISTRATION', 'VET_TRANSPORTATION'],
    },
  });

  // 3. Helpers
  const helper1User = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex@petco.com',
      passwordHash: defaultPassword,
      role: Role.HELPER,
      phone: '+1-555-0201',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      location: 'Castro, San Francisco, CA',
      latitude: 37.7609,
      longitude: -122.4350,
    },
  });

  const helper1 = await prisma.helperProfile.create({
    data: {
      userId: helper1User.id,
      bio: 'Certified professional dog walker and passionate pet sitter with 6+ years of experience. CPR & First Aid certified.',
      experience: '6+ years with all dog breeds, reactive dogs, puppies and senior pets.',
      skills: ['Dog CPR', 'Behavior Management', 'Leash Training', 'Senior Dogs'],
      hourlyRate: 30.0,
      serviceRadius: 15.0,
      services: [
        ServiceType.DOG_WALKING,
        ServiceType.PET_SITTING,
        ServiceType.GROOMING,
        ServiceType.FEEDING,
        ServiceType.PET_PICKUP_DROP,
      ],
      pricing: {
        DOG_WALKING: 30,
        PET_SITTING: 60,
        GROOMING: 45,
        FEEDING: 25,
        PET_PICKUP_DROP: 35,
      },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      workingHours: [
        { day: 'Monday', enabled: true, startTime: '07:00', endTime: '19:00' },
        { day: 'Tuesday', enabled: true, startTime: '07:00', endTime: '19:00' },
        { day: 'Wednesday', enabled: true, startTime: '07:00', endTime: '19:00' },
        { day: 'Thursday', enabled: true, startTime: '07:00', endTime: '19:00' },
        { day: 'Friday', enabled: true, startTime: '07:00', endTime: '19:00' },
        { day: 'Saturday', enabled: true, startTime: '09:00', endTime: '17:00' },
        { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '17:00' },
      ],
      maxBookingsPerDay: 6,
      isAvailable: true,
      verificationStatus: VerificationStatus.VERIFIED,
      governmentIdUrl: 'https://storage.googleapis.com/petco-docs/id-alex.pdf',
      certificationUrl: 'https://storage.googleapis.com/petco-docs/cpr-cert-alex.pdf',
      rating: 4.95,
      totalReviews: 42,
    },
  });

  const helper2User = await prisma.user.create({
    data: {
      name: 'Maya Chen',
      email: 'maya@petco.com',
      passwordHash: defaultPassword,
      role: Role.HELPER,
      phone: '+1-555-0202',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      location: 'Marina District, San Francisco, CA',
      latitude: 37.8037,
      longitude: -122.4368,
    },
  });

  const helper2 = await prisma.helperProfile.create({
    data: {
      userId: helper2User.id,
      bio: 'Former veterinary assistant with specialized expertise in oral/injectable medication, post-op recovery, and emergency pet transit.',
      experience: '4 years veterinary clinic assistant + 3 years private medical pet care.',
      skills: ['Medication Administration', 'Post-Op Care', 'Sub-Q Fluids', 'Emergency Transport', 'Vet Accompaniment'],
      hourlyRate: 40.0,
      serviceRadius: 20.0,
      services: [
        ServiceType.MEDICINE_ADMINISTRATION,
        ServiceType.MEDICINE_PICKUP,
        ServiceType.POST_SURGERY_CARE,
        ServiceType.HEALTH_CHECK_ASSISTANCE,
        ServiceType.VET_VISIT_ASSISTANCE,
        ServiceType.VET_TRANSPORTATION,
        ServiceType.EMERGENCY_VET_ASSISTANCE,
        ServiceType.EMERGENCY_CHECK_IN,
      ],
      pricing: {
        MEDICINE_ADMINISTRATION: 40,
        MEDICINE_PICKUP: 30,
        POST_SURGERY_CARE: 55,
        HEALTH_CHECK_ASSISTANCE: 35,
        VET_VISIT_ASSISTANCE: 50,
        VET_TRANSPORTATION: 45,
        EMERGENCY_VET_ASSISTANCE: 65,
        EMERGENCY_CHECK_IN: 45,
      },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      workingHours: [
        { day: 'Monday', enabled: true, startTime: '06:00', endTime: '22:00' },
        { day: 'Tuesday', enabled: true, startTime: '06:00', endTime: '22:00' },
        { day: 'Wednesday', enabled: true, startTime: '06:00', endTime: '22:00' },
        { day: 'Thursday', enabled: true, startTime: '06:00', endTime: '22:00' },
        { day: 'Friday', enabled: true, startTime: '06:00', endTime: '22:00' },
        { day: 'Saturday', enabled: true, startTime: '08:00', endTime: '20:00' },
        { day: 'Sunday', enabled: true, startTime: '08:00', endTime: '20:00' },
      ],
      maxBookingsPerDay: 5,
      isAvailable: true,
      verificationStatus: VerificationStatus.VERIFIED,
      governmentIdUrl: 'https://storage.googleapis.com/petco-docs/id-maya.pdf',
      certificationUrl: 'https://storage.googleapis.com/petco-docs/vet-tech-cert-maya.pdf',
      rating: 5.0,
      totalReviews: 31,
    },
  });

  const helper3User = await prisma.user.create({
    data: {
      name: 'Lucas Wright',
      email: 'lucas@petco.com',
      passwordHash: defaultPassword,
      role: Role.HELPER,
      phone: '+1-555-0203',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
      location: 'Noe Valley, San Francisco, CA',
      latitude: 37.7502,
      longitude: -122.4337,
    },
  });

  const helper3 = await prisma.helperProfile.create({
    data: {
      userId: helper3User.id,
      bio: 'Big dog enthusiast with a large fenced yard and home boarding setup. Flexible schedule 7 days a week.',
      experience: '5 years home boarding & pack walks.',
      skills: ['Home Boarding', 'Large Breed Handling', 'Yard Play', 'Bathing'],
      hourlyRate: 28.0,
      serviceRadius: 12.0,
      services: [
        ServiceType.PET_BOARDING,
        ServiceType.DOG_WALKING,
        ServiceType.FEEDING,
        ServiceType.BATHING,
      ],
      pricing: {
        PET_BOARDING: 75,
        DOG_WALKING: 28,
        FEEDING: 20,
        BATHING: 40,
      },
      isAvailable: true,
      verificationStatus: VerificationStatus.PENDING,
      governmentIdUrl: 'https://storage.googleapis.com/petco-docs/id-lucas.pdf',
      rating: 4.8,
      totalReviews: 19,
    },
  });

  // 4. Pets with Complete Medical Profiles
  const petMilo = await prisma.pet.create({
    data: {
      ownerId: owner1.id,
      name: 'Milo',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'Male',
      weight: 32.5,
      description: 'Super friendly, energetic, loves tennis balls and swimming.',
      medicalConditions: 'Mild hip dysplasia on left leg.',
      allergies: 'Chicken kibble, beef rawhide.',
      vaccinations: 'Rabies (Exp 2027), DHPP, Bordetella, Leptospirosis up to date.',
      medications: 'Glucosamine joint chew daily with morning meal.',
      specialInstructions: 'Do not let him run on slick concrete or jump out of tall SUVs without ramp.',
      behaviorNotes: 'Loves other dogs, gets excited around squirrels.',
      emergencyNotes: 'Pet Emergency Vet SF: (415) 555-9911. Policy #PET-482019.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    },
  });

  const petLuna = await prisma.pet.create({
    data: {
      ownerId: owner1.id,
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      age: 2,
      gender: 'Female',
      weight: 4.2,
      description: 'Calm indoor cat, enjoys feather wand toys and sunny windowsills.',
      medicalConditions: 'None',
      allergies: 'None',
      vaccinations: 'FVRCP, Rabies up to date.',
      specialInstructions: 'Keep all front/balcony doors firmly latched.',
      behaviorNotes: 'Timid around loud doorbells.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
    },
  });

  const petRocky = await prisma.pet.create({
    data: {
      ownerId: owner2.id,
      name: 'Rocky',
      species: 'Dog',
      breed: 'French Bulldog',
      age: 4,
      gender: 'Male',
      weight: 12.0,
      description: 'Playful couch potato. Needs short leisurely walks with plenty of hydration.',
      medicalConditions: 'Brachycephalic airway sensitivity.',
      allergies: 'Grass pollen in spring.',
      vaccinations: 'All current.',
      specialInstructions: 'Never walk during high heat (>75°F). Always use harness, never collar.',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
    },
  });

  const petBella = await prisma.pet.create({
    data: {
      ownerId: owner3.id,
      name: 'Bella',
      species: 'Dog',
      breed: 'Beagle',
      age: 1,
      gender: 'Female',
      weight: 9.5,
      description: 'Curious puppy recovering from mild ear inflammation.',
      medicalConditions: 'Otitis externa (right ear).',
      allergies: 'None known.',
      vaccinations: 'Puppy core series complete.',
      medications: 'Posatex otic suspension 4 drops in right ear every 24 hours.',
      specialInstructions: 'Give treat immediately after ear drops administration.',
      emergencyNotes: 'Mission Pet Hospital: (415) 555-3829.',
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop',
    },
  });

  // 5. Service Requests across Categories
  // Category 1: BASIC_CARE
  const request1 = await prisma.serviceRequest.create({
    data: {
      ownerId: owner1.id,
      petId: petMilo.id,
      category: ServiceCategory.BASIC_CARE,
      serviceType: ServiceType.DOG_WALKING,
      title: 'Afternoon Dog Walk & Park Fetch for Milo',
      description: 'Looking for a 60-minute energetic walk and fetch session at Dolores Park for Milo.',
      location: 'Dolores Park, San Francisco, CA',
      latitude: 37.7596,
      longitude: -122.4269,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      startTime: '14:00',
      endTime: '15:00',
      budget: 35.0,
      status: RequestStatus.ACCEPTED,
    },
  });

  // Category 2: MEDICAL_HEALTH (with Medicine Details)
  const request2 = await prisma.serviceRequest.create({
    data: {
      ownerId: owner3.id,
      petId: petBella.id,
      category: ServiceCategory.MEDICAL_HEALTH,
      serviceType: ServiceType.MEDICINE_ADMINISTRATION,
      title: 'Ear Drops Administration & Morning Routine for Bella',
      description: 'Need a certified or experienced helper to gently clean and administer 4 drops of Posatex into Bella’s right ear.',
      location: 'Pacific Heights, San Francisco, CA',
      latitude: 37.7925,
      longitude: -122.4382,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      startTime: '08:30',
      endTime: '09:15',
      budget: 45.0,
      isEmergency: false,
      medicineDetails: {
        medicineName: 'Posatex Otic Drops',
        dosage: '4 drops in right ear canal',
        frequency: 'Every 24 hours',
        startDate: '2026-10-10',
        endDate: '2026-10-17',
        instructions: 'Massage ear base for 15 seconds after drops. Reward with salmon treat.',
        vetName: 'Dr. Clara Vance, Mission Pet Hospital',
        vetPhone: '+1-415-555-3829',
      },
      status: RequestStatus.OPEN,
    },
  });

  // Category 3: EMERGENCY (High Priority)
  const requestEmergency = await prisma.serviceRequest.create({
    data: {
      ownerId: owner2.id,
      petId: petRocky.id,
      category: ServiceCategory.EMERGENCY,
      serviceType: ServiceType.EMERGENCY_VET_ASSISTANCE,
      title: '🚨 URGENT: Accompaniment & Transit to SF Veterinary Specialists',
      description: 'Rocky ate a small piece of chocolate off the kitchen counter. Need an immediate companion helper with a vehicle to assist in taking him to the emergency vet.',
      location: 'SoMa, San Francisco, CA',
      latitude: 37.7785,
      longitude: -122.3950,
      scheduledDate: new Date(),
      startTime: 'Immediate',
      endTime: '2 hours',
      budget: 90.0,
      isEmergency: true,
      customFields: {
        ingestedItem: 'Dark chocolate (~15 grams)',
        timeIngested: '20 minutes ago',
        emergencyClinic: 'SF Vet Specialists (24/7)',
      },
      status: RequestStatus.OPEN,
    },
  });

  // Category 4: TRANSPORTATION
  const requestTransport = await prisma.serviceRequest.create({
    data: {
      ownerId: owner1.id,
      petId: petLuna.id,
      category: ServiceCategory.TRANSPORTATION,
      serviceType: ServiceType.VET_TRANSPORTATION,
      title: 'Safe Cat Carrier Ride to Routine Checkup',
      description: 'Need pet taxi from Mission District to SF Vet Hospital and back for annual wellness check.',
      location: 'Mission District, San Francisco, CA',
      latitude: 37.7599,
      longitude: -122.4148,
      scheduledDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      startTime: '10:30',
      endTime: '12:00',
      budget: 50.0,
      status: RequestStatus.OPEN,
    },
  });

  // Completed Request
  const requestCompleted = await prisma.serviceRequest.create({
    data: {
      ownerId: owner1.id,
      petId: petLuna.id,
      category: ServiceCategory.BASIC_CARE,
      serviceType: ServiceType.FEEDING,
      title: 'Cat Feeding and Litter Refresh for Luna',
      description: '30 minute check-in to feed Luna wet food, clean water fountain, and refresh litter box.',
      location: 'Mission District, San Francisco, CA',
      latitude: 37.7599,
      longitude: -122.4148,
      scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      startTime: '10:00',
      endTime: '10:30',
      budget: 25.0,
      status: RequestStatus.COMPLETED,
    },
  });

  // 6. Helper Counter-Offers
  await prisma.helperOffer.create({
    data: {
      requestId: request2.id,
      helperId: helper2User.id,
      offeredPrice: 42.0,
      proposedTime: '08:45 AM',
      note: 'I am a certified vet assistant with extensive experience in gentle otic drop administration. I will ensure Bella is completely stress-free!',
      status: 'PENDING',
    },
  });

  await prisma.helperOffer.create({
    data: {
      requestId: requestEmergency.id,
      helperId: helper2User.id,
      offeredPrice: 85.0,
      proposedTime: 'Immediate (within 10 mins)',
      note: 'I am 5 minutes away in SoMa with a clean pet carrier and pet first aid kit in my car. Ready to roll immediately!',
      status: 'PENDING',
    },
  });

  // 7. Bookings
  const activeBooking = await prisma.booking.create({
    data: {
      requestId: request1.id,
      ownerId: owner1.id,
      helperId: helper1User.id,
      agreedPrice: 35.0,
      status: BookingStatus.CONFIRMED,
    },
  });

  const completedBooking = await prisma.booking.create({
    data: {
      requestId: requestCompleted.id,
      ownerId: owner1.id,
      helperId: helper2User.id,
      agreedPrice: 25.0,
      status: BookingStatus.COMPLETED,
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000),
    },
  });

  // 8. Reviews
  await prisma.review.create({
    data: {
      bookingId: completedBooking.id,
      reviewerId: owner1.id,
      reviewedUserId: helper2User.id,
      rating: 5,
      comment: 'Maya was incredible with Luna! Sent lovely photo updates and followed feeding instructions to the letter.',
    },
  });

  // 9. Chat Messages
  await prisma.message.createMany({
    data: [
      {
        bookingId: activeBooking.id,
        senderId: owner1.id,
        receiverId: helper1User.id,
        message: "Hi Alex! Thanks for accepting the booking. Milo's favorite ball is near the front door!",
        createdAt: new Date(Date.now() - 3600 * 1000),
      },
      {
        bookingId: activeBooking.id,
        senderId: helper1User.id,
        receiverId: owner1.id,
        message: "Sounds great Sarah! I'll be there promptly at 2:00 PM with treats. Looking forward to meeting Milo!",
        createdAt: new Date(Date.now() - 1800 * 1000),
      },
    ],
  });

  // 10. Safety Reports
  await prisma.report.create({
    data: {
      reporterId: owner1.id,
      reportedUserId: helper3User.id,
      reason: ReportReason.OTHER,
      description: 'Helper cancelled 10 minutes prior to a scheduled walk without prior notice.',
      status: ReportStatus.OPEN,
    },
  });

  // 11. Admin Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        adminId: admin.id,
        action: 'VERIFIED_HELPER',
        targetType: 'USER',
        targetId: helper1User.id,
        details: { helperName: helper1User.name, reviewedDocs: ['governmentId', 'cprCert'] },
      },
      {
        adminId: admin.id,
        action: 'VERIFIED_HELPER',
        targetType: 'USER',
        targetId: helper2User.id,
        details: { helperName: helper2User.name, reviewedDocs: ['governmentId', 'vetTechCert'] },
      },
    ],
  });

  // 12. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: owner1.id,
        type: NotificationType.BOOKING_CONFIRMED,
        title: 'Booking Confirmed!',
        message: 'Alex Rivera confirmed your booking for Milo tomorrow at 2:00 PM.',
        data: { bookingId: activeBooking.id },
      },
      {
        userId: helper1User.id,
        type: NotificationType.REQUEST_ACCEPTED,
        title: 'Upcoming Booking',
        message: 'You have a confirmed walk with Milo tomorrow at 2:00 PM.',
        data: { bookingId: activeBooking.id },
      },
      {
        userId: admin.id,
        type: NotificationType.EMERGENCY_ALERT,
        title: '🚨 Emergency Request Posted',
        message: 'David Miller posted an urgent vet assistance request for Rocky in SoMa.',
        data: { requestId: requestEmergency.id },
      },
    ],
  });

  console.log('✅ PetCo database successfully seeded with 3-Role Ecosystem:');
  console.log(' - Admin: admin@petco.com / Password123!');
  console.log(' - Customers: sarah@petco.com, david@petco.com, emma@petco.com / Password123!');
  console.log(' - Helpers: alex@petco.com, maya@petco.com, lucas@petco.com / Password123!');
  console.log(' - Categories: Basic Care, Medical & Vet Health, Transportation, Emergency, Custom');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
