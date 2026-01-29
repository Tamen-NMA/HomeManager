import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isAuth = !!req.auth;
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/error");
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/chores") ||
    pathname.startsWith("/meals") ||
    pathname.startsWith("/household") ||
    pathname.startsWith("/settings");

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chores/:path*",
    "/meals/:path*",
    "/household/:path*",
    "/settings/:path*",
    "/signin",
    "/error",
  ],
};
