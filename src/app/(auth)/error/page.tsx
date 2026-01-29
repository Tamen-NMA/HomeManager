"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "Access denied. You do not have permission.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An unexpected error occurred. Please try again.",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-cream-dark bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-2xl font-bold text-warm-gray">Authentication Error</h1>
        <p className="text-warm-gray-light">
          {errorMessages[error || ""] || errorMessages.Default}
        </p>
        <Link
          href="/signin"
          className="inline-block rounded-lg bg-terracotta px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
