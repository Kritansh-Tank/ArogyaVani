'use client';
import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaHospital, FaTimes, FaCheckCircle } from 'react-icons/fa';

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const FACILITIES = [
    'PHC Block A - Gandhi Nagar',
    'City Hospital OPD',
    'Community Health Centre',
    'Apollo Clinic',
    'District General Hospital',
];

export default function AppointmentModal({ consultationId, triageLevel, symptoms, onClose }) {
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [facility, setFacility] = useState('');
    const [loading, setLoading] = useState(false);
    const [booked, setBooked] = useState(false);

    const isEmergency = triageLevel === 'emergency';

    const handleBook = async () => {
        if (!date || !timeSlot || !facility) return;
        setLoading(true);
        try {
            await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    consultationId,
                    appointmentDate: date,
                    timeSlot,
                    facilityName: facility,
                    doctorName: 'Dr. (On Duty)',
                }),
            });
            setBooked(true);
        } catch (err) {
            console.error('Booking failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const triageColors = {
        home: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: '🟢 Home Care Recommended' },
        clinic: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: '🟡 Visit Clinic Recommended' },
        emergency: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: '🔴 Emergency Care Needed' },
    };
    const t = triageColors[triageLevel] || triageColors.clinic;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
                borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '100%',
                border: '1px solid rgba(6,182,212,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                position: 'relative',
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
                }}>
                    <FaTimes size={18} />
                </button>

                {booked ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <FaCheckCircle size={52} color="#10b981" />
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '1rem', color: 'var(--text-primary)' }}>
                            Appointment Confirmed!
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            {facility} · {date} · {timeSlot}
                        </div>
                        <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '1.5rem', color: '#fff' }}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                            {isEmergency ? '🚨 Seek Emergency Care Now' : 'Book a Clinic Appointment'}
                        </div>

                        {/* Triage badge */}
                        <div style={{ background: t.bg, color: t.color, borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                            {t.label}
                        </div>

                        {isEmergency && (
                            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#ef4444', fontSize: '0.85rem' }}>
                                ⚠️ Please go to the nearest emergency ward immediately. You can still book a follow-up below.
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Date */}
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                    <FaCalendarAlt size={12} /> Preferred Date
                                </label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.25)', background: '#f8fafc', fontSize: '0.9rem', color: 'var(--text-primary)' }} />
                            </div>

                            {/* Time slot */}
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                    <FaClock size={12} /> Time Slot
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {TIME_SLOTS.map((slot) => (
                                        <button key={slot} onClick={() => setTimeSlot(slot)}
                                            style={{
                                                padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer',
                                                border: `1px solid ${timeSlot === slot ? '#06b6d4' : 'rgba(6,182,212,0.2)'}`,
                                                background: timeSlot === slot ? '#06b6d4' : '#f8fafc',
                                                color: timeSlot === slot ? '#fff' : 'var(--text-secondary)',
                                            }}>
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Facility */}
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                                    <FaHospital size={12} /> Facility
                                </label>
                                <select value={facility} onChange={(e) => setFacility(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.25)', background: '#f8fafc', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                    <option value="">Select facility...</option>
                                    {FACILITIES.map((f) => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>

                            <button onClick={handleBook} disabled={!date || !timeSlot || !facility || loading}
                                className="btn btn-primary" style={{
                                    color: '#fff', opacity: (!date || !timeSlot || !facility || loading) ? 0.5 : 1,
                                    cursor: (!date || !timeSlot || !facility || loading) ? 'not-allowed' : 'pointer',
                                }}>
                                {loading ? 'Booking...' : 'Confirm Appointment'}
                            </button>

                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Skip for now
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
