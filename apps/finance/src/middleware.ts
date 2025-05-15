import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const accesToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  console.log("access token", accesToken);
  console.log("refresh token", refreshToken);

  if (!refreshToken) {
    return NextResponse.redirect(
      `http://localhost:3000/auth/signin?redirectURL=${encodeURIComponent(req.url)}`
    );
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
