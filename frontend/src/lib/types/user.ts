export type UserRole = "admin" | "participant" | "volunteer";

export type User = {
  id: string;
  name: string;
  role: UserRole;
};
