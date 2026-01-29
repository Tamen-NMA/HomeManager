"use client";

import { useState } from "react";
import UserMenu from "@/components/auth/UserMenu";
import MobileNav from "./MobileNav";
import Logo from "./Logo";

export default function Topbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-cream-dark bg-white px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 text-warm-gray transition-colors hover:bg-cream lg:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
        </div>
        <UserMenu />
      </header>
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
