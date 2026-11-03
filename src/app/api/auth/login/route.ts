import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/auth';
import { DummyAuthUser } from '@/services/api/auth/authApi';
import { UserProfile } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Hit ke DummyJSON Auth Login API menggunakan Axios di sisi server
    const response = await axios.post<DummyAuthUser>(
      'https://dummyjson.com/auth/login',
      {
        username,
        password,
        expiresInMins: 60, // Sesi token 60 menit
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const dummyUser = response.data;

    // DATA NORMAL: Informasi profil publik untuk ditampilkan ke UI & disimpan di Zustand
    const normalUserData: UserProfile = {
      id: dummyUser.id,
      username: dummyUser.username,
      name: `${dummyUser.firstName} ${dummyUser.lastName}`,
      email: dummyUser.email,
      firstName: dummyUser.firstName,
      lastName: dummyUser.lastName,
      gender: dummyUser.gender,
      avatar: dummyUser.image,
      role: 'admin', // DummyJSON roles
    };

    // DATA RAHASIA: Simpan accessToken & refreshToken ke HttpOnly Cookies
    // Token ini kebal XSS (tidak bisa diakses JavaScript di browser)
    const cookieStore = await cookies();

    // 1. Simpan Access Token
    cookieStore.set({
      name: AUTH_COOKIE_NAME,
      value: dummyUser.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 60 menit
    });

    // 2. Simpan Refresh Token
    if (dummyUser.refreshToken) {
      cookieStore.set({
        name: REFRESH_COOKIE_NAME,
        value: dummyUser.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 hari
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Login berhasil via DummyJSON',
      user: normalUserData,
    });
  } catch (error: any) {
    console.error('Login error DummyJSON:', error?.response?.data || error?.message);
    const apiError = error?.response?.data?.message || 'Username atau password salah!';
    return NextResponse.json(
      { success: false, message: apiError },
      { status: error?.response?.status || 401 }
    );
  }
}
