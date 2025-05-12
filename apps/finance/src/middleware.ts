import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken'

export async function middleware(req: NextRequest) {
   const cookieStore = await cookies()
   const session = cookieStore.get("nubras-session");

   console.log(session)
   if(!session) {
    return NextResponse.redirect("http://localhost:3000/api/auth/signin")
   }
   

   try {
    jwt.verify(session.value, process.env.NEXTAUTH_SECRET!)
  } catch (err) {
    console.log(err)
    // Token expired or invalid
    return NextResponse.redirect('http://localhost:3000/api/auth/signin')
  }

  return NextResponse.next();
}

export const config = { matcher: ['/:path*'] };
