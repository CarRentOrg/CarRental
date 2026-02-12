import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isProtectedUserPath = pathname.startsWith("/bookings");
  const isLoginPage = pathname === "/login";

  // Redirect legacy paths
  if (pathname === "/admin/login" || pathname === "/owner/login") {
    return NextResponse.redirect(new URL("/login" + search, request.url));
  }

  const ownerToken = request.cookies.get("ownerToken")?.value;
  const userToken = request.cookies.get("token")?.value;

  // 1. If at /login and already authenticated, redirect away
  if (isLoginPage) {
    if (ownerToken)
      return NextResponse.redirect(new URL("/admin", request.url));
    if (userToken) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  // 2. Admin Guard
  if (isAdminPath) {
    if (!ownerToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const payload = JSON.parse(atob(ownerToken.split(".")[1]));
      if (payload.role !== "owner") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      const resp = NextResponse.redirect(new URL("/login", request.url));
      resp.cookies.delete("ownerToken");
      return resp;
    }
  }

  // 3. User Protected Path Guard
  if (isProtectedUserPath) {
    if (!userToken && !ownerToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/bookings/:path*",
    "/login",
    "/admin/login",
    "/owner/login",
  ],
};
