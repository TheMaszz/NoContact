'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MIN_LOADING_MS } from '../constant/constant';
import Loading from '../components/Loading';


export default function InitGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    if (pathname === '/initialize') {
      setIsLoading(false);
      return;
    }

    const savedProfile = localStorage.getItem('user_profile');

    const finish = () => {
      if (cancelled) return;

      if (!savedProfile) {
        router.push('/initialize');
        return;
      }
      setIsLoading(false);
    };

    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(MIN_LOADING_MS - elapsed, 0);
    const timer = setTimeout(finish, remaining);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [router, pathname]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
}