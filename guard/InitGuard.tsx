"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MIN_LOADING_MS } from "@/constant/constant";
import Loading from "@/components/Loading";
import { useAppStore } from "@/lib/store";


export default function InitGuard({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    const checkAndFinish = () => {
      if (cancelled) return;

      if (pathname === "/initialize") {
        setIsLoading(false);
        return;
      }

      const profile = useAppStore.getState().profile;

      if (!profile) {
        router.push("/initialize");
        return;
      }

      setIsLoading(false);
    };

    const handleInitialization = async () => {
      if (!useAppStore.persist.hasHydrated()) {
        await useAppStore.persist.rehydrate();
      }

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(MIN_LOADING_MS - elapsed, 0);

      window.setTimeout(checkAndFinish, remaining);
    };

    handleInitialization();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}