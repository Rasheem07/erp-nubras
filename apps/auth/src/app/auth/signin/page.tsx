// app/auth/signin/page.tsx
"use client";

import { getCsrfToken } from "next-auth/react";
import { useState, useEffect } from "react";

export default async function SignIn() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  
  useEffect(() => {
    getCsrfToken().then((t) => setCsrfToken(t ?? null));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-center text-gray-900">
          Sign in to Nubras ERP
        </h1>
        <form
          method="post"
          action="/api/auth/callback/email"
          className="space-y-4"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken!} />
          <label className="block">
            <span className="text-gray-700">Email address</span>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-brand-200 placeholder:text-gray-400"
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  );
}
