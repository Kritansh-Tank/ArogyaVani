import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseAdmin } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'arogya-vani-secret-2026';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

        const supabase = getSupabaseAdmin();

        // Check if user exists
        const { data: existing } = await supabase.from('app_users').select('id').eq('email', email).single();
        if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

        const hashed = await bcrypt.hash(password, 10);
        const { data: user, error } = await supabase
            .from('app_users')
            .insert([{ email, password_hash: hashed }])
            .select('id, email')
            .single();

        if (error) throw error;

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
        response.cookies.set('auth_token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
        console.log(`[auth/signup] new user: ${email}`);
        return response;
    } catch (err) {
        console.error('[auth/signup] error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
