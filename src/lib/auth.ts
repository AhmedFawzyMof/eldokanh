import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

import { db } from "@/db";
import { admins, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      id: "google-mobile",
      name: "Google Mobile",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        try {
          const ticket = await client.verifyIdToken({
            idToken: credentials.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          const payload = ticket.getPayload();
          if (!payload || !payload.email) return null;

          // Find or create user
          let user = await db.query.users.findFirst({
            where: eq(users.email, payload.email),
          });

          if (!user) {
            const result = await db
              .insert(users)
              .values({
                name: payload.name || payload.email.split("@")[0],
                email: payload.email,
                provider: "google",
                providerId: payload.sub,
                password: null,
              })
              .returning();
            user = result[0];
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Google Token Verification Error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id.toString(), name: user.name, email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      if (account.provider === "google") {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        if (!existingUser) {
          await db.insert(users).values({
            name: user.name!,
            email: user.email!,
            provider: account.provider,
            providerId: account.providerAccountId,
            password: null,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // On initial sign-in, user will be defined.
        // We need the database user ID, not the provider's ID.
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        if (dbUser) {
          token.id = dbUser.id.toString();

          // Check if user is an admin
          const adminData = await db.query.admins.findFirst({
            where: eq(admins.userId, dbUser.id),
          });

          if (adminData) {
            token.role = "admin";
            token.permissions = adminData.permissions;
          } else {
            token.role = "user";
          }
        } else {
          // Fallback if user not found (shouldn't happen with signIn callback)
          token.id = user.id;
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Safety net: If baseUrl is localhost:3000, swap it for the production domain
      // so physical mobile devices don't get stuck on a localhost redirect.
      const effectiveBaseUrl = baseUrl.includes("localhost:3000")
        ? "https://eldokanh.com"
        : baseUrl;

      // Allow Capacitor custom app scheme
      if (url.startsWith("com.eldokanh.app://")) {
        return url;
      }

      // If the URL contains 'callback=app' or is exactly 'app',
      // it's a request from our mobile application.
      if (url.includes("callback=app") || url === "app") {
        return `${effectiveBaseUrl}/auth/mobile-success`;
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${effectiveBaseUrl}${url}`;

      // Allows callback URLs on the same origin
      try {
        const urlObj = new URL(url);
        const baseObj = new URL(effectiveBaseUrl);
        if (urlObj.origin === baseObj.origin) return url;
      } catch (e) {
        // If URL is invalid or relative but doesn't start with /
      }

      return effectiveBaseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
