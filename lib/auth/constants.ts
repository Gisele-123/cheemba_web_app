export const ADMIN_EMAIL = "admin@cheemba.rw";
export const ADMIN_PASSWORD = "07983846666";

export const APP_ROLES = {
  ADMIN: "admin",
  COMPANY: "collection_company",
  HOUSEHOLD: "household",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];
