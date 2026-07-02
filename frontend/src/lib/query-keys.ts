/**
 * Central TanStack Query key factory. Every feature registers its keys here
 * so invalidation is discoverable and never stringly-typed at call sites.
 */
export const queryKeys = {
  admin: {
    all: ["admin"] as const,
    stats: () => [...queryKeys.admin.all, "stats"] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
} as const;
