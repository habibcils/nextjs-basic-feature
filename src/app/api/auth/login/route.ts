import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, findUserByEmail, getUserWithoutPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    if (!user || user.passwordHash !== password) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const safeUser = getUserWithoutPassword(user);

    // Payload token sederhana (di production gunakan JWT signed token)
    const tokenPayload = {
      userId: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      name: safeUser.name,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };

    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    // Simpan ke Secure Cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true, // Tidak bisa diakses oleh JavaScript di browser (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Hanya HTTPS saat production
      sameSite: 'lax', // Proteksi CSRF
      path: '/',
      maxAge: 60 * 60 * 24, // Berlaku 1 hari (dalam detik)
    });

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

