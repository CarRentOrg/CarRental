import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Paths
  const isOwnerPath = request.nextUrl.pathname.startsWith("/admin");
  const isUserPath =
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/bookings");

  if ((isOwnerPath || isUserPath) && !token) {
    // If trying to access protected route without token, redirect to home
    // (Regular users login during booking, owners via secret link)
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If token exists, we could decode it normally to check roles
  // For simplicity here, we rely on the backend to reject invalid role access
  // but we can add a basic check if we want to be proactive.
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64));

      if (isOwnerPath && decoded.role !== "owner") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isUserPath && decoded.role !== "user" && decoded.role !== "owner") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      // Invalid token
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Config to match only relevant paths
export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/bookings/:path*"],
};
