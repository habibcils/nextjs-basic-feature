import React from 'react';
import Link from 'next/link';
import { Result, Button } from 'antd';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="404"
        title="404"
        subTitle="Maaf, halaman yang Anda tuju tidak ditemukan."
        extra={
          <Link href="/dashboard">
            <Button type="primary">Kembali ke Dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}

