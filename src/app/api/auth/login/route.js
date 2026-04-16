import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabaseAdmin } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'arogya-vani-secret-2026';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const supabase = getSupabaseAdmin();

        const { data: user, error } = await supabase.from('app_users').select('id, email, password_hash').eq('email', email).single();
        if (error || !user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
        response.cookies.set('auth_token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
        console.log(`[auth/login] success: ${email}`);
        return response;
    } catch (err) {
        console.error('[auth/login] error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
