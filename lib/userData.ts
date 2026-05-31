import type { SupabaseClient } from "@supabase/supabase-js";
import {
  emptyUserDataPayload,
  isUserDataPayload,
  type UserDataPayload,
} from "@/types/userData";

export async function fetchUserData(
  supabase: SupabaseClient,
  userId: string
): Promise<UserDataPayload | null> {
  const { data, error } = await supabase
    .from("user_data")
    .select("payload")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data?.payload) return null;
  if (!isUserDataPayload(data.payload)) return null;
  return data.payload;
}

export async function saveUserData(
  supabase: SupabaseClient,
  userId: string,
  payload: UserDataPayload
): Promise<void> {
  const { error } = await supabase.from("user_data").upsert(
    {
      user_id: userId,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;
}

export function hasUserData(payload: UserDataPayload | null): boolean {
  if (!payload) return false;
  return (
    payload.tasks.length > 0 ||
    payload.goals.length > 0 ||
    payload.memos.length > 0 ||
    Boolean(
      payload.profile.name ||
        payload.profile.role ||
        payload.profile.focus ||
        payload.profile.notes
    )
  );
}

export function mergeAuthProfile(
  payload: UserDataPayload,
  metadata: {
    display_name?: string;
    full_name?: string;
    name?: string;
    email?: string;
  }
): UserDataPayload {
  if (payload.profile.name?.trim()) return payload;

  const name =
    metadata.display_name?.trim() ||
    metadata.full_name?.trim() ||
    metadata.name?.trim() ||
    metadata.email?.split("@")[0] ||
    "";

  if (!name) return payload;

  return {
    ...payload,
    profile: { ...payload.profile, name },
  };
}

export { emptyUserDataPayload };
