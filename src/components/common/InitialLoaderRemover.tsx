'use client';

import { useEffect } from 'react';

export default function InitialLoaderRemover() {
  useEffect(() => {
    // Dipanggil tepat saat React selesai hydrate di browser
    const loader = document.getElementById('spa-initial-loader');
    if (loader) {
      loader.classList.add('fade-out');
      const timer = setTimeout(() => {
        loader.style.display = 'none';
      }, 450); // Sembunyikan elemen tanpa menghapus node dari DOM agar reconciler React tidak bentrok
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}

