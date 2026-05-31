"use client";

import { useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  fetchUserData,
  mergeAuthProfile,
  saveUserData,
} from "@/lib/userData";
import { getTaskStorePayload, useTaskStore } from "@/store/useTaskStore";
import { emptyUserDataPayload, type UserDataPayload } from "@/types/userData";

const SAVE_DELAY_MS = 800;

function isSamePayload(a: UserDataPayload, b: UserDataPayload): boolean {
  return (
    a.tasks === b.tasks &&
    a.goals === b.goals &&
    a.memos === b.memos &&
    a.profile === b.profile
  );
}

export function CloudSync() {
  const setHydrated = useTaskStore((s) => s.setHydrated);
  const userIdRef = useRef<string | null>(null);
  const loadedUserIdRef = useRef<string | null>(null);
  const applyingCloudRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPayloadRef = useRef<UserDataPayload>(emptyUserDataPayload());

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setHydrated(true);
      return;
    }

    const supabase = createClient();

    const loadCloud = async (user: User) => {
      if (applyingCloudRef.current) return;
      if (loadedUserIdRef.current === user.id) return;

      applyingCloudRef.current = true;
      try {
        const cloud = await fetchUserData(supabase, user.id);
        const metadata = user.user_metadata as {
          display_name?: string;
          full_name?: string;
          name?: string;
          email?: string;
        };

        const payload = mergeAuthProfile(cloud ?? emptyUserDataPayload(), {
          ...metadata,
          email: user.email ?? metadata.email,
        });

        useTaskStore.getState().replaceFromCloud(payload);
        prevPayloadRef.current = payload;
        loadedUserIdRef.current = user.id;

        if (!cloud) {
          await saveUserData(supabase, user.id, payload);
        }
      } catch (err) {
        console.error("[CloudSync] load failed", err);
        setHydrated(true);
      } finally {
        applyingCloudRef.current = false;
        setHydrated(true);
      }
    };

    const scheduleSave = () => {
      const userId = userIdRef.current;
      if (!userId || applyingCloudRef.current) return;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          await saveUserData(supabase, userId, getTaskStorePayload());
        } catch (err) {
          console.error("[CloudSync] save failed", err);
        }
      }, SAVE_DELAY_MS);
    };

    const handleSession = async (user: User | null) => {
      if (!user) {
        userIdRef.current = null;
        loadedUserIdRef.current = null;
        useTaskStore.getState().replaceFromCloud(emptyUserDataPayload());
        prevPayloadRef.current = emptyUserDataPayload();
        setHydrated(false);
        return;
      }

      userIdRef.current = user.id;
      await loadCloud(user);
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      void handleSession(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleSession(session?.user ?? null);
    });

    const unsubStore = useTaskStore.subscribe((state) => {
      const next: UserDataPayload = {
        tasks: state.tasks,
        goals: state.goals,
        memos: state.memos,
        profile: state.profile,
      };

      if (isSamePayload(next, prevPayloadRef.current)) return;

      prevPayloadRef.current = next;
      scheduleSave();
    });

    return () => {
      subscription.unsubscribe();
      unsubStore();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [setHydrated]);

  return null;
}
