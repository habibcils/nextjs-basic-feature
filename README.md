# Learn Next.js - Modern Admin Dashboard

Aplikasi Dashboard Admin modern yang dibangun menggunakan **Next.js (App Router)**, **Ant Design**, **Zustand**, dan sistem autentikasi aman berbasis **Secure HttpOnly Cookies**.

---

## 🚀 Fitur Utama

1. **Next.js App Router**: Arsitektur modular terbaru dengan route groups `(auth)` dan `(dashboard)` serta API Route Handlers.
2. **Secure Cookie-Based Authentication**:
   - Token sesi disimpan di `httpOnly` cookie sehingga aman dari serangan XSS (tidak bisa dibaca via `document.cookie` oleh JavaScript browser).
   - Dilengkapi atribut `SameSite: 'lax'` dan `secure` untuk proteksi CSRF.
   - **Next.js Middleware (`src/middleware.ts`)** yang memproteksi rute secara instan di level server/edge.
3. **Zustand State Management**:
   - Pengelolaan state client yang ringan, cepat, dan reaktif untuk data profil pengguna dan status collapse sidebar.
   - Auto-hydration saat halaman dimuat ulang melalui `/api/auth/me`.
4. **Ant Design UI System**:
   - Menggunakan `@ant-design/nextjs-registry` untuk integrasi Server-Side Rendering (SSR) yang mulus tanpa kedip (Flash of Unstyled Content).
   - Komponen lengkap: Layout, Sider, Header, Form, Table, Modal, Popconfirm, Tabs, Statistic, Progress, Badge, Avatar, Dropdown.
5. **Dashboard Lengkap dengan 3 Menu/Halaman**:
   - **Halaman 1 - Dashboard (`/dashboard`)**: KPI Cards (Pendapatan, Pengguna Aktif, Transaksi, Kepuasan), Tabel Aktivitas Transaksi Terbaru, Pencapaian Kuartal, dan Status Server.
   - **Halaman 2 - Manajemen Pengguna (`/users`)**: Tabel daftar pengguna, fitur pencarian realtime, filter peran (Role), Modal Tambah Pengguna, Edit Pengguna, dan konfirmasi Hapus (Popconfirm).
   - **Halaman 3 - Pengaturan (`/settings`)**: Ant Design Tabs berisi Form Profil Pengguna, Ganti Kata Sandi & 2FA Toggle, serta Preferensi Notifikasi & Bahasa.

---

## 📁 Struktur Folder Project

```text
learn-nextjs/
├── src/
│   ├── app/                                # Next.js App Router
│   │   ├── (auth)/                         # Route Group Autentikasi (tanpa layout dashboard)
│   │   │   └── login/
│   │   │       └── page.tsx                # Halaman Login interaktif + tombol 1-klik Akun Demo
│   │   ├── (dashboard)/                    # Route Group Dashboard (dengan layout admin)
│   │   │   ├── layout.tsx                  # Layout Dashboard (Sidebar + Topbar + Content + Footer)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                # Menu 1: Overview & Statistik KPI
│   │   │   ├── users/
│   │   │   │   └── page.tsx                # Menu 2: Manajemen Pengguna & Tabel CRUD
│   │   │   └── settings/
│   │   │       └── page.tsx                # Menu 3: Pengaturan Akun, Keamanan & Preferensi
│   │   ├── api/                            # Backend API Route Handlers
│   │   │   └── auth/
│   │   │       ├── login/route.ts          # Endpoint Login: verifikasi & set Secure HttpOnly Cookie
│   │   │       ├── logout/route.ts         # Endpoint Logout: hapus Cookie
│   │   │       └── me/route.ts             # Endpoint Sesi: cek token sesi pengguna saat ini
│   │   ├── globals.css                     # Pengaturan CSS global
│   │   ├── layout.tsx                      # Root Layout utama aplikasi
│   │   ├── not-found.tsx                   # Halaman 404 elegan dengan Ant Design Result
│   │   └── page.tsx                        # Root Redirect (ke /dashboard jika login, /login jika belum)
│   │
│   ├── components/                         # Komponen Reusable
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx                 # Ant Design Sider (Collapsible, Logo, Navigasi Menu)
│   │   │   └── Topbar.tsx                  # Ant Design Header (Hamburger toggle, Notif, User Dropdown)
│   │   └── providers/
│   │       └── AntdProvider.tsx            # Wrapper AntdRegistry + ConfigProvider tema
│   │
│   ├── store/                              # State Management (Zustand)
│   │   └── useAuthStore.ts                 # Store autentikasi, user session & sidebar state
│   │
│   ├── lib/                                # Utility & Helper Functions
│   │   └── auth.ts                         # Konfigurasi cookie & mock database pengguna
│   │
│   ├── types/                              # Definisi TypeScript
│   │   └── auth.ts                         # Interface User, LoginCredentials, AuthResponse
│   │
│   └── middleware.ts                       # Next.js Server Middleware (Proteksi Rute Cookie)
│
├── public/                                 # Asset statis publik
├── package.json                            # Dependensi aplikasi
├── tsconfig.json                           # Konfigurasi TypeScript
├── next.config.ts                          # Konfigurasi Next.js
└── README.md                               # Dokumentasi project
```

---

## 🔑 Akun Demo untuk Pengujian

Halaman login telah dilengkapi tombol cepat 1-klik untuk langsung mengisi akun demo:

| Peran (Role) | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `admin123` | Akses Penuh ke seluruh modul |
| **Staff** | `staff@example.com` | `staff123` | Akses Operasional |

---

## 🔒 Mengapa Autentikasi dengan HttpOnly Cookies Aman?

1. **Kebal terhadap Pencurian XSS**: Token tidak disimpan di `localStorage` atau `sessionStorage`. Cookie dengan flag `httpOnly: true` sama sekali tidak dapat dibaca oleh script JavaScript jahat.
2. **Validasi Instan di Server Edge (`middleware.ts`)**: Sebelum halaman dashboard di-*render* atau diakses oleh peramban pengguna, Next.js Middleware memeriksa keberadaan cookie sesi. Jika tidak valid/kosong, pengguna otomatis diarahkan (*redirect*) ke `/login`.
3. **Proteksi CSRF**: Dengan `SameSite: 'lax'`, browser hanya mengirimkan cookie pada navigasi tingkat atas dari situs yang sama, mencegah serangan pemalsuan permintaan antar-situs.

---

## 🛠️ Cara Menjalankan Project

### 1. Masuk ke direktori project
```bash
cd learn-nextjs
```

### 2. Jalankan server pengembangan (Development)
```bash
npm run dev
```
Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

### 3. Build untuk Production
```bash
npm run build
npm run start
```
