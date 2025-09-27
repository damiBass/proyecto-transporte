import type { TripPayloadV2 } from "@shared/api";

export type LocalTrip = TripPayloadV2 & { id: string; createdAt: number; driverEmail?: string };

export function loadLocal(key: string): LocalTrip[] {
  try {
    const raw = localStorage.getItem(`rv_trips_local_v2:${key}`);
    if (!raw) return [];
    const arr = JSON.parse(raw) as LocalTrip[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveLocal(key: string, list: LocalTrip[]) {
  localStorage.setItem(`rv_trips_local_v2:${key}`, JSON.stringify(list));
}
