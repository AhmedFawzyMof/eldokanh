import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: string;
      permissions: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    permissions?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    permissions?: string | null;
    accessToken?: string;
  }
}
