# 🐾 PetCo — Cross-Platform Hyperlocal Pet Care Marketplace

PetCo connects pet parents with verified, five-star neighborhood pet-care helpers for dog walking, sitting, feeding, grooming, and medical support across **Web** (Next.js) and **Mobile** (React Native / Expo), powered by a single centralized **Express + TypeScript + Prisma + PostgreSQL + Socket.IO** backend.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────┐
                               │     Web Application    │
                               │ Next.js 14 + Tailwind  │
                               └───────────┬────────────┘
                                           │ (REST / WebSocket)
                                           ▼
┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│   Mobile Application   │────▶│    Express API Server  │────▶│  PostgreSQL (Prisma)   │
│   React Native (Expo)  │     │ Node.js + TypeScript   │     │ Normalized Relational  │
└────────────────────────┘     └───────────┬────────────┘     └────────────────────────┘
                                           │
                                           ▼
                               ┌────────────────────────┐
                               │  Real-Time Socket.IO   │
                               │ Chat, GPS, Live Alerts │
                               └────────────────────────┘
```

---

## 🚀 Repository Structure

```
PawCo/
├── packages/
│   └── shared/                # Shared TypeScript interfaces, enums, constants, Zod schemas
│       ├── src/types/
│       ├── src/validation/
│       └── src/constants/
├── server/                    # Central Express REST & Socket.IO backend
│   ├── prisma/
│   │   ├── schema.prisma      # PostgreSQL relational schema
│   │   └── seed.ts            # Realistic seed script
│   └── src/
│       ├── controllers/       # Auth, Users, Pets, Helpers, Requests, Bookings, Reviews, Messages, Admin
│       ├── services/          # Business logic & Haversine distance calculations
│       ├── middlewares/       # JWT auth, Role authorization, Zod validation, Error handler
│       ├── sockets/           # Real-time chat & notifications
│       └── __tests__/         # Backend test suites
├── apps/
│   ├── web/                   # Next.js 14 Web Application
│   │   └── src/
│   │       ├── app/           # App Router (Landing, Login, Register, Dashboards)
│   │       ├── components/    # Reusable UI library (Button, Modal, Card, Badge, Avatar, Tabs)
│   │       └── context/       # Auth and Socket live contexts
│   └── mobile/                # React Native / Expo Mobile Application
│       ├── src/
│       │   ├── screens/       # Owner, Helper, Chat, Create Request, Nearby Jobs screens
│       │   └── context/       # Mobile Auth Context
│       └── App.tsx
└── docs/
    └── ARCHITECTURE.md
```

---

## 🔑 Demo Accounts (Pre-Seeded)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@petco.com` | `Password123!` | Full platform administration, helper verification & KPI metrics |
| **Pet Owner** | `sarah@petco.com` | `Password123!` | Owner of Milo (Golden Retriever) & Luna (Siamese Cat) |
| **Pet Owner** | `david@petco.com` | `Password123!` | Owner of Rocky (French Bulldog) |
| **Pet Helper** | `alex@petco.com` | `Password123!` | Verified 5.0★ Dog Trainer (Walking, Sitting, Grooming) |
| **Pet Helper** | `maya@petco.com` | `Password123!` | Verified 5.0★ Veterinary Assistant (Medication, Feeding) |

---

## 🛠️ Getting Started & Setup Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **PostgreSQL**: Local PostgreSQL or Cloud Database URL (Supabase, Neon, Railway, Render)

### 2. Configure Database & Environment
Edit `server/.env` with your PostgreSQL database URL:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/petco?schema=public"
JWT_SECRET="petco_super_secure_access_token_secret_key"
JWT_REFRESH_SECRET="petco_super_secure_refresh_token_secret_key"
```

### 3. Initialize Database & Seed
```bash
# Push schema to PostgreSQL
npm run db:migrate

# Seed sample owners, helpers, pets, requests & bookings
npm run db:seed
```

### 4. Running the Applications

#### Run Central Backend Server (Port 5000):
```bash
npm run dev:server
```

#### Run Next.js Web App (Port 3000):
```bash
npm run dev:web
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

#### Run Mobile App (Expo):
```bash
npm run dev:mobile
```
Press `w` for web, `a` for Android, `i` for iOS emulator, or scan QR code with the **Expo Go** mobile app.

---

## 🧪 Testing Backend Services

Run backend test suites:
```bash
npm run test:server
```
