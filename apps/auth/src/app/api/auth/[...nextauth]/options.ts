// apps/auth/lib/authOptions.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider, { SendVerificationRequestParams } from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const isProd = process.env.NODE_ENV === "production";
export const AuthOptions: NextAuthOptions = {
    debug: true,
    adapter: PrismaAdapter(prisma),

    providers: [
        EmailProvider({
            server: {
                host: process.env.SMTP_HOST!,
                port: Number(process.env.SMTP_PORT!),
                auth: {
                    user: process.env.SMTP_USER!,
                    pass: process.env.SMTP_PASS!,
                },
            },
            from: process.env.SMTP_USER,

            async sendVerificationRequest(params: SendVerificationRequestParams) {
                const { identifier, url, expires, provider } = params;
                const { host } = new URL(url);
                const transport = nodemailer.createTransport(provider.server);
                await transport.sendMail({
                    to: identifier,
                    from: provider.from,
                    subject: `Sign in to ${host}`,
                    text: `Use this link to sign in: ${url}\nExpires at ${expires.toISOString()}`,
                    html: `<p><a href="${url}">Sign in to <strong>${host}</strong></a></p>
                 <p>Expires at ${expires.toISOString()}</p>`,
                });
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 8,
        updateAge: 60 * 60,
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            //   session.user!.id = token.sub!;
            session.user!.email = token.email as string;
            return session;
        },
    },


    cookies: {
        sessionToken: {
            name: isProd
                ? "__Secure-nubras-session"
                : "nubras-session",
            options: {
                httpOnly: true,
                secure: isProd,        // true in prod, false in dev
                sameSite: "lax",
                path: "/",
                // only set domain in prod:
                domain: isProd ? ".nubras.com" : undefined,
            },
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

