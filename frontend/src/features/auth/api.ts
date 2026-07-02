import { api } from "@/lib/api-client";

export interface LoginResponse {
  token: string;
  user: { id: string; name: string | null; role: string };
}

export const login = (identifier: string, password: string) =>
  api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
