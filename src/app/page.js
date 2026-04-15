import Link from 'next/link';
import {
  FaGlobe, FaBrain, FaMicrophone, FaHospital, FaShieldAlt, FaBolt,
  FaChartBar, FaMapMarkerAlt, FaUserFriends,
  FaHeart,
} from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';

const featureCards = [
  { Icon: FaGlobe, color: '#06b6d4', title: 'Multilingual Triage', desc: 'Speak in English or Hindi. ArogyaVani collects symptoms in your language and routes you correctly — home care, clinic visit, or emergency — without any language barrier.' },
  { Icon: FaBrain, color: '#a855f7', title: 'Semantic Medical Search', desc: 'Powered by Qdrant vector search and Jina AI embeddings, the assistant semantically matches symptoms to medical knowledge — going beyond keywords to understand what you mean.' },
  { Icon: FaMicrophone, color: '#10b981', title: 'Voice-First Triage', desc: 'No reading or typing required. Speak your symptoms, duration, and age — and get an instant triage decision: 🟢 home care, 🟡 visit a clinic, or 🔴 go to emergency now.' },
  { Icon: FaHospital, color: '#f59e0b', title: 'Comprehensive Coverage', desc: 'From common conditions like fever and cold to emergencies like snake bites and heart attacks — our knowledge base covers 30+ essential health topics.' },
  { Icon: FaShieldAlt, color: '#06b6d4', title: 'Always Available', desc: 'Available 24/7 without appointments or waiting. Get immediate health guidance anytime, anywhere — bridging the gap where healthcare access is limited.' },
  { Icon: FaBolt, color: '#ef4444', title: 'Real-Time Responses', desc: 'Powered by Vapi\'s advanced voice AI, conversations feel natural with low-latency, real-time responses — just like talking to a health advisor.' },
];

const impactCards = [
  { Icon: FaChartBar, color: '#06b6d4', title: '25% of India is illiterate', desc: 'Over 250 million people cannot read health information. Voice AI makes healthcare guidance accessible without literacy.' },
  { Icon: FaMapMarkerAlt, color: '#f59e0b', title: 'Rural Healthcare Gap', desc: '60% of primary health centers in rural India lack doctors. ArogyaVani provides immediate first-aid and health guidance.' },
  { Icon: FaUserFriends, color: '#a855f7', title: 'Elderly-Friendly', desc: 'Older adults often struggle with smartphones and apps. Voice interaction is the most natural and comfortable interface for them.' },
];

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <MdHealthAndSafety size={24} color="#06b6d4" style={{ marginRight: '0.4rem' }} />
            ArogyaVani
          </Link>
          <ul className="navbar-links">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/knowledge">Knowledge Base</Link></li>
            <li><Link href="/about">About</Link></li>
            <li>
              <Link href="/assistant" className="btn btn-primary" style={{ color: '#fff' }}>
                Try Voice Triage →
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot" />
            Voice Triage Assistant · HackBLR 2026
          </div>
          <h1 className="hero-title">
            Healthcare at<br />
            <span className="gradient-text">Your Voice</span>
          </h1>
          <p className="hero-subtitle">
            ArogyaVani is a multilingual voice triage assistant — it collects your
            symptoms, searches its medical knowledge base, and tells you whether to
            manage at home, visit a clinic, or go to emergency. All through voice.
          </p>
          <div className="hero-actions">
            <Link href="/assistant" className="btn btn-primary btn-lg">
              <FaMicrophone style={{ marginRight: '0.5rem' }} /> Start Speaking
            </Link>
            <a href="#features" className="btn btn-outline btn-lg">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">2+</div>
            <div className="stat-label">Languages Supported</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">30+</div>
            <div className="stat-label">Medical Topics</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Always Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Literacy Required</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">
            Designed for <span className="gradient-text">Everyone</span>
          </h2>
          <p className="section-desc">
            Voice triage that collects symptoms, searches medical knowledge,
            and routes patients — no smartphones, typing, or literacy needed.
          </p>
        </div>
        <div className="features-grid">
          {featureCards.map(({ Icon, color, title, desc }, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '12px', padding: '0.75rem', display: 'inline-flex' }}>
                <Icon size={22} color={color} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section" id="how-it-works">
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">
            Simple as <span className="gradient-text">Speaking</span>
          </h2>
          <p className="section-desc">
            Three steps to go from symptom to triage decision — entirely by voice.
          </p>
        </div>
        <div className="steps-grid">
          {[
            { title: 'Describe Symptoms', desc: 'Press the mic and say your symptom, how long you\'ve had it, and your age. Speak naturally in English or Hindi.' },
            { title: 'AI Triages', desc: 'Vapi captures your voice. Qdrant semantically retrieves the most relevant medical knowledge to assess your condition.' },
            { title: 'Get Routed', desc: 'Receive a clear triage decision — 🟢 manage at home, 🟡 visit a clinic within 24hrs, or 🔴 go to emergency now.' },
          ].map(({ title, desc }, i) => {
            return (
              <div key={i} className="step-card">
                <div className="step-number" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  {i + 1}
                </div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Impact */}
      <section className="section" id="impact">
        <div className="section-header">
          <span className="section-tag">Impact</span>
          <h2 className="section-title">
            Why <span className="gradient-text">ArogyaVani</span> Matters
          </h2>
          <p className="section-desc">
            Bridging the healthcare information gap for millions who face
            barriers in accessing digital health services.
          </p>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {impactCards.map(({ Icon, color, title, desc }, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '12px', padding: '0.75rem', display: 'inline-flex' }}>
                <Icon size={22} color={color} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
          Ready to <span className="gradient-text">experience it</span>?
        </h2>
        <p className="section-desc" style={{ marginBottom: '2rem' }}>
          Try ArogyaVani now — speak your health concern and get instant guidance.
        </p>
        <Link href="/assistant" className="btn btn-primary btn-lg">
          <FaMicrophone style={{ marginRight: '0.5rem' }} /> Launch Voice Assistant
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-text">
            ArogyaVani — Built for HackBLR 2026 with <FaHeart style={{ display: 'inline', color: '#ef4444', margin: '0 0.25rem' }} /> | Powered by Vapi &amp; Qdrant
          </p>
          <div className="footer-links">
            <a href="https://discord.gg/vapi" target="_blank" rel="noopener noreferrer">Vapi</a>
            <a href="https://discord.gg/qdrant" target="_blank" rel="noopener noreferrer">Qdrant</a>
          </div>
        </div>
      </footer>
    </>
  );
}
