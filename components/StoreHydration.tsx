"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";

export function StoreHydration() {
  const setHydrated = useTaskStore((s) => s.setHydrated);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return null;
}
