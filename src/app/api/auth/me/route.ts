import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, MOCK_USERS, getUserWithoutPassword } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    try {
      const decodedJson = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedJson);

      if (payload.exp && Date.now() > payload.exp) {
        return NextResponse.json(
          { success: false, message: 'Sesi telah kedaluwarsa' },
          { status: 401 }
        );
      }

      const user = MOCK_USERS.find((u) => u.id === payload.userId);
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Pengguna tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: getUserWithoutPassword(user),
      });
    } catch {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

