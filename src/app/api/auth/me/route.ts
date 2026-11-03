import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { DummyAuthUser } from '@/services/api/auth/authApi';
import { UserProfile } from '@/types/auth';

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

    // Verifikasi token rahasia ke DummyJSON /auth/me
    const response = await axios.get<DummyAuthUser>('https://dummyjson.com/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dummyUser = response.data;
    const normalUserData: UserProfile = {
      id: dummyUser.id,
      username: dummyUser.username,
      name: `${dummyUser.firstName} ${dummyUser.lastName}`,
      email: dummyUser.email,
      firstName: dummyUser.firstName,
      lastName: dummyUser.lastName,
      gender: dummyUser.gender,
      avatar: dummyUser.image,
      role: 'admin',
    };

    return NextResponse.json({
      success: true,
      user: normalUserData,
    });
  } catch (error: any) {
    console.error('Session verification error:', error?.response?.data || error?.message);
    return NextResponse.json(
      { success: false, message: 'Token kedaluwarsa atau tidak valid' },
      { status: 401 }
    );
  }
}
