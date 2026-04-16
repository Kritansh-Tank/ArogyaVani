# 🩺 ArogyaVani — Voice Triage Assistant

> **HackBLR 2026 · Track 3 — Medical: End-to-End Accessible Healthcare Assistance**

ArogyaVani is a **voice-first, multilingual triage assistant** that collects patient symptoms through natural conversation, searches a curated medical knowledge base using semantic AI, and routes patients to the right level of care — entirely by voice, in English or Hindi.

---

## 🎯 Problem Statement

Healthcare access in India faces three critical barriers:

- **250M+** people cannot read written health information (25% illiteracy rate)
- **60%** of primary health centers in rural India lack doctors
- Language diversity makes text-based health apps inaccessible to most

ArogyaVani removes all three barriers with a single voice interaction.

---

## 🚀 Live Demo

```
http://localhost:3000
```

Pages:
| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | 🔐 Sign in / Sign up |
| `/assistant` | 🎙️ Live voice triage assistant *(auth required)* |
| `/dashboard` | 📊 Real-time triage analytics *(auth required)* |
| `/knowledge` | 📚 Medical knowledge base browser *(auth required)* |
| `/about` | 🔧 Architecture & tech stack |

---

## ⚙️ How It Works

```
User speaks symptom
      ↓
Vapi (STT + voice AI)
      ↓
GPT-4o mini (function calling)
      ↓
Jina AI embeds query (jina-embeddings-v2-base-en, 768 dims)
      ↓
Qdrant semantic search (cosine similarity)
      ↓
Triage decision: 🟢 Home Care | 🟡 Visit Clinic | 🔴 Emergency
      ↓
ElevenLabs TTS speaks the response
      ↓
Consultation saved to Supabase (EHR)
      ↓
Appointment booking modal (clinic/emergency cases)
```

### Triage Workflow (3-Step Protocol)
1. **Collect** — Ask: *symptom, duration, age*
2. **Search** — Semantically retrieve relevant medical knowledge from Qdrant
3. **Route** — Always end with a triage level classification

---

## 🛠️ Tech Stack

| Tool | Role |
|---|---|
| **Vapi** | Real-time voice AI, STT, function calling |
| **Qdrant Cloud** | Vector database for semantic medical search |
| **Jina AI** (`jina-embeddings-v2-base-en`) | Hosted 768-dim embeddings (1M tokens free) |
| **GPT-4o mini** | Conversational reasoning & triage decisions (via Vapi credits) |
| **ElevenLabs** | Multilingual TTS (EN + HI voices) |
| **Next.js 16** | Full-stack framework (App Router) |
| **Supabase** | PostgreSQL DB for users, consultations & appointments |
| **bcryptjs + jose** | Password hashing & Edge-compatible JWT auth |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js                      # Landing page
│   ├── globals.css                  # Design system (light theme, glassmorphism)
│   ├── login/page.js                # Sign in / Sign up
│   ├── assistant/page.js            # Voice triage interface
│   ├── dashboard/page.js            # Live analytics (real Supabase data)
│   ├── knowledge/page.js            # Medical knowledge browser
│   ├── about/page.js                # Architecture & about
│   └── api/
│       ├── auth/
│       │   ├── signup/route.js      # Register — bcrypt hash + JWT cookie
│       │   ├── login/route.js       # Login — password verify + JWT cookie
│       │   └── logout/route.js      # Clear auth cookie
│       ├── appointments/route.js    # CRUD for appointment bookings
│       ├── consultations/latest/    # Fetch most recent consultation
│       ├── seed/route.js            # Seeds Qdrant with 30 medical entries
│       └── vapi/route.js            # Vapi webhook (tool calls + EHR save)
├── components/
│   ├── GlobalBackground.js          # Fixed animated background (all pages)
│   └── AppointmentModal.js          # Post-triage booking modal
├── hooks/
│   └── useVapi.js                   # Vapi Web SDK integration
├── lib/
│   ├── supabase.js                  # Supabase browser + admin clients
│   ├── qdrant.js                    # Qdrant client singleton
│   ├── embeddings.js                # Jina AI / Ollama embedding utility
│   └── medical-data.js             # 30 bilingual medical knowledge entries
└── middleware.js                    # JWT route protection (jose, Edge-compatible)
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- Supabase project (free tier)
- Qdrant Cloud account
- Vapi account
- Jina AI account (free, 1M tokens at [jina.ai](https://jina.ai))

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
VAPI_PRIVATE_KEY=your_vapi_private_key
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key
JINA_API_KEY=your_jina_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_secret_string
```

### 3. Create Supabase tables (one-time)

Run in **Supabase → SQL Editor**:

```sql
create table app_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table consultations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  created_at timestamptz default now(),
  language text default 'en',
  triage_level text,
  symptoms text,
  summary text,
  duration_seconds int,
  call_id text
);

create table appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  consultation_id uuid references consultations,
  created_at timestamptz default now(),
  appointment_date date,
  time_slot text,
  facility_name text,
  doctor_name text,
  status text default 'confirmed'
);

alter table app_users enable row level security;
alter table consultations enable row level security;
alter table appointments enable row level security;
create policy "allow all" on app_users for all using (true) with check (true);
create policy "allow all" on consultations for all using (true) with check (true);
create policy "allow all" on appointments for all using (true) with check (true);
```

### 4. Start the dev server

```bash
npm run dev
```

### 5. Seed the knowledge base (one-time)

```bash
curl -X POST http://localhost:3000/api/seed
```

### 6. Open the app

Visit **http://localhost:3000/login** → Create an account → Start voice triage.

---

## 🌐 Knowledge Base

30 curated, bilingual (English + Hindi) medical entries across categories:

| Category | Topics |
|---|---|
| 💊 Conditions | Fever, Cold, Diabetes, Hypertension, Asthma, TB, Dengue |
| 🚨 Emergency | Heart Attack, Snake Bite, Burns, Heatstroke, Diarrhea |
| 🛡️ Preventive | Malaria, Hygiene, Nutrition, Clean Water |
| 🤰 Maternal | Pregnancy Care, Antenatal Visits |
| 👶 Child Health | Vaccination Schedule |
| 🧠 Mental Health | Stress, Anxiety, Depression |

---

## 🔮 Future Improvements (Offline Round)

### 🏥 Clinical Integration
- **FHIR/HL7 EHR** — Pull full patient history before triage
- **IVR / Phone Calls** — Reach non-smartphone users via Vapi phone numbers
- **Doctor Handoff** — Auto-generate SOAP-format summaries for physicians

### 🤖 AI Enhancements
- **Longitudinal Memory** — Per-patient symptom history in Qdrant
- **Differential Diagnosis** — Multi-turn Bayesian scoring across conditions
- **Drug Interaction Checker** — Warn about dangerous combinations

### 🌍 Accessibility
- **Offline PWA** — Cached knowledge base + local LLM via WebLLM
- **More Languages** — Kannada, Tamil, Telugu, Bengali, Marathi
- **WhatsApp Bot** — Same triage flow over WhatsApp

---

## 👥 Built at HackBLR 2026

> Powered by **Vapi** · **Qdrant** · **Supabase** · **Jina AI** · **Next.js**
