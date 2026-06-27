// Pure merge helper for per-song "shows" (view counts), used by the store when
// syncing local state with Firebase. Counts only ever grow, so when the same song
// has a local and a remote count we keep the bigger one ("prefer bigger shows"):
// this lets offline-accumulated increments survive a login/reconnect instead of
// being clobbered by a stale remote value (and vice-versa across devices).

type ShowsMap = Record<string, number>;

// Returns `merged` — the prefer-bigger union of local and remote — and `toPush` —
// the subset whose merged value exceeds the current remote value (i.e. the keys
// that must be written back up to Firebase).
export function mergeShowsPreferBigger(
  local: ShowsMap,
  remote: ShowsMap,
): { merged: ShowsMap; toPush: ShowsMap } {
  const merged: ShowsMap = { ...remote, ...local };
  const toPush: ShowsMap = {};
  for (const k of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const max = Math.max(local[k] || 0, remote[k] || 0);
    merged[k] = max;
    if (max !== (remote[k] || 0)) toPush[k] = max;
  }
  return { merged, toPush };
}
