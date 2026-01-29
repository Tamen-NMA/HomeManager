import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-cream-dark bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-terracotta">Naya Dream Home</h1>
          <p className="mt-2 text-warm-gray">
            Sign in to manage your household
          </p>
        </div>
        <GoogleSignInButton />
      </div>
    </div>
  );
}
