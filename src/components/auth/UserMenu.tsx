"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!session?.user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-cream-dark"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white">
            {session.user.name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <span className="hidden text-sm font-medium text-warm-gray md:block">
          {session.user.name}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-cream-dark bg-white py-1 shadow-lg">
          <div className="border-b border-cream-dark px-4 py-2">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-warm-gray-light">{session.user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-4 py-2 text-left text-sm text-warm-gray transition-colors hover:bg-cream"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
