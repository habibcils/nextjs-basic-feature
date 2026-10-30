'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Event emitter global sederhana agar router.push dan navigasi apapun bisa memicu progress bar
export const topProgress = {
  start: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('top-progress-start'));
    }
  },
  done: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('top-progress-done'));
    }
  },
};

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMount = useRef(true);

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setVisible(true);
    setProgress(15);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 90;
        }
        // Simulasi pergerakan progress secara alami
        const increment = Math.max(1, (90 - prev) * 0.15);
        return prev + increment;
      });
    }, 100);
  };

  const finishProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);

    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  // Listen event global kustom
  useEffect(() => {
    const handleStart = () => startProgress();
    const handleDone = () => finishProgress();

    window.addEventListener('top-progress-start', handleStart);
    window.addEventListener('top-progress-done', handleDone);

    return () => {
      window.removeEventListener('top-progress-start', handleStart);
      window.removeEventListener('top-progress-done', handleDone);
    };
  }, []);

  // Intersep klik pada elemen apapun yang berbau navigasi (tag <a>, antd menu item, dsb)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1. Cek tag <a> standard
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        const targetAttr = anchor.getAttribute('target');
        if (
          href &&
          href.startsWith('/') &&
          !href.startsWith('//') &&
          targetAttr !== '_blank' &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          const currentUrl = window.location.pathname + window.location.search;
          if (href !== currentUrl) {
            startProgress();
            return;
          }
        }
      }

      // 2. Cek Ant Design Menu Item (.ant-menu-item)
      const antMenuItem = target.closest('.ant-menu-item');
      if (antMenuItem) {
        // Jika menu item diklik dan bukan item yang sedang terpilih
        if (!antMenuItem.classList.contains('ant-menu-item-selected')) {
          startProgress();
          return;
        }
      }

      // 3. Cek Ant Design Dropdown Item (.ant-dropdown-menu-item)
      const antDropdownItem = target.closest('.ant-dropdown-menu-item');
      if (antDropdownItem) {
        startProgress();
      }
    };

    // Gunakan capture: true agar tertangkap sebelum event stopPropagation dari library UI
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // Setiap kali URL berhasil berganti (rute selesai dirender)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    finishProgress();
  }, [pathname, searchParams]);

  if (!visible && progress === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        zIndex: 99999999,
        pointerEvents: 'none',
        backgroundColor: 'rgba(22, 119, 255, 0.1)',
      }}
    >
      {/* Bar Garis Utama */}
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#1677ff',
          boxShadow: '0 0 12px #1677ff, 0 0 6px #69b1ff',
          transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.35s ease' : 'width 0.25s ease-out',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
      {/* Titik Cahaya (Glow peg) di ujung kanan garis */}
      {visible && progress > 0 && progress < 100 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${progress}%`,
            width: '100px',
            height: '100%',
            boxShadow: '0 0 10px #1677ff, 0 0 5px #1677ff',
            opacity: 1,
            transform: 'rotate(3deg) translateY(-4px)',
          }}
        />
      )}
    </div>
  );
}
