'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cancelAllPendingRequests } from '@/services/api/axiosInstance';

/**
 * Hook custom untuk membatalkan seluruh request axios yang sedang berjalan
 * saat user berpindah halaman di Next.js App Router.
 */
export function useCancelPendingRequestsOnRouteChange() {
  const pathname = usePathname();
  const currentPathRef = useRef(pathname);

  useEffect(() => {
    // Jika pathname berganti, batalkan semua request lama yang belum selesai
    if (currentPathRef.current !== pathname) {
      cancelAllPendingRequests(`Navigasi dari ${currentPathRef.current} ke ${pathname}`);
      currentPathRef.current = pathname;
    }

    // Cleanup saat unmount total
    return () => {
      cancelAllPendingRequests('Komponen/Halaman unmount');
    };
  }, [pathname]);
}

