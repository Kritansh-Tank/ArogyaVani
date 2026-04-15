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
| `/assistant` | 🎙️ Live voice triage assistant |
| `/dashboard` | 📊 Triage analytics dashboard |
| `/knowledge` | 📚 Medical knowledge base browser |
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

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js                  # Landing page
│   ├── globals.css              # Design system (dark theme, glassmorphism)
│   ├── assistant/page.js        # Voice triage interface
│   ├── dashboard/page.js        # Analytics dashboard
│   ├── knowledge/page.js        # Medical knowledge browser
│   ├── about/page.js            # Architecture & about
│   └── api/
│       ├── seed/route.js        # Seeds Qdrant with 30 medical entries
│       ├── search/route.js      # Semantic search endpoint
│       └── vapi/route.js        # Vapi webhook handler
├── hooks/
│   └── useVapi.js               # Vapi Web SDK integration
└── lib/
    ├── qdrant.js                # Qdrant client singleton
    ├── embeddings.js            # Ollama embedding utility
    └── medical-data.js          # 30 bilingual medical knowledge entries
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- Qdrant Cloud account (or local Qdrant instance)
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
```

### 3. Pull Ollama model

```bash
npm run dev
```

### 5. Seed the Qdrant knowledge base (one-time)

```bash
curl -X POST http://localhost:3000/api/seed
```

### 6. Open the app

Visit **http://localhost:3000** → Click **Try Voice Triage** → Speak your symptom.

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

If selected for the offline round, the following enhancements are planned:

### 🏥 Clinical Integration
- **EHR Integration** — Connect with open standards (FHIR/HL7) to pull patient history before triage
- **Appointment Booking** — After a 🟡 Clinic triage, automatically book the nearest available PHC slot via integrations with platforms like Practo or eVital
- **Doctor Handoff** — Generate a structured SOAP-format summary of the voice conversation to hand off to the attending physician

### 🤖 AI Enhancements
- **Personalized Memory** — Use Qdrant to store per-patient conversation history and symptom patterns for longitudinal tracking
- **Differential Diagnosis Engine** — Multi-turn symptom collection with Bayesian probability scoring across conditions
- **Drug Interaction Checker** — Integrate with a drug database API to warn about dangerous drug combinations

### 🌍 Accessibility & Scale
- **Offline Mode** — PWA with cached knowledge base for areas with no internet (using IndexedDB + local LLM via WebLLM)
- **More Languages** — Expand beyond Hindi to Tamil, Telugu, Bengali, Marathi using regional TTS/STT models
- **IVR Integration** — Deploy on basic phone calls (no smartphone needed) via Twilio + Vapi phone numbers
- **WhatsApp Bot** — Reach patients on WhatsApp with the same voice triage flow

### 📊 Analytics & Ops
- **Real-time Monitoring** — Live Qdrant collection stats, Vapi call logs, and triage trend graphs
- **Outbreak Detection** — Cluster symptom patterns geographically to flag potential disease outbreaks to health authorities
- **Feedback Loop** — Patient-reported outcome tracking to improve triage accuracy over time

---

## 👥 Built at HackBLR 2026

> Powered by **Vapi** · **Qdrant** · **Ollama** · **Next.js**
