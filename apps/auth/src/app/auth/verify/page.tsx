// app/auth/verify/page.tsx

export default function Verify() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="px-8 py-6 text-center bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-brand-700">
          Check your email
        </h2>
        <p className="mt-2 text-gray-600">
          We sent you a magic link. Click it to sign in.
        </p>
      </div>
    </div>
  );
}
