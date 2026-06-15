import { CANDIDATES } from "../data/candidates";

// Normalize fields — add snake_case aliases so both
// CandidateCard (camelCase) and CandidateDetail (snake_case) work correctly
const normalized = CANDIDATES.map((c) => ({
  ...c,
  response_rate: c.responseRate,
  last_active: c.lastActive,
  core_match: c.coreMatch,
}));

export function useRankings() {
  return { rankings: normalized, loading: false };
}
