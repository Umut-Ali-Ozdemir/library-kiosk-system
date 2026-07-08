import { apiFetch } from "./client";
import type { FloorSummary } from "../types";

export function getFloors() {
  return apiFetch<FloorSummary[]>("/floors");
}
