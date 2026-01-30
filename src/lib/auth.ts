import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        
        if (!email || !credentials?.password) {
          logger.warn("Tentative de connexion sans credentials", {
            action: "auth_attempt",
          });
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user || !user.encrypted_password) {
          // Log mais avec un délai constant pour éviter les timing attacks
          logger.authAttempt(email, false);
          // Délai artificiel pour éviter les timing attacks
          await new Promise((resolve) => setTimeout(resolve, 100));
          return null;
        }

        // Le mot de passe est hashé avec bcrypt (compatible Devise Rails)
        const isValid = await compare(
          credentials.password as string,
          user.encrypted_password
        );

        if (!isValid) {
          logger.authAttempt(email, false);
          return null;
        }

        logger.authAttempt(email, true);
        
        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 heures
  },
  // Configuration de sécurité
  trustHost: true,
});
