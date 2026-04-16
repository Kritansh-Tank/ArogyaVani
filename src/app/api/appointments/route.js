import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, consultationId, appointmentDate, timeSlot, facilityName, doctorName } = body;

        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('appointments')
            .insert([{ user_id: userId, consultation_id: consultationId, appointment_date: appointmentDate, time_slot: timeSlot, facility_name: facilityName, doctor_name: doctorName }])
            .select()
            .single();

        if (error) throw error;
        console.log('[appointments] booked:', data.id);
        return NextResponse.json({ success: true, appointment: data });
    } catch (err) {
        console.error('[appointments] error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .order('appointment_date', { ascending: true });

        if (error) throw error;
        return NextResponse.json({ appointments: data });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
