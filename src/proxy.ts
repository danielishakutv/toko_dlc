import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  // Protected page routes
  const isDashboard = pathname.startsWith("/dashboard");
  const isChangePassword = pathname === "/change-password";

  if (!isDashboard && !isChangePassword) {
    return NextResponse.next();
  }

  // No session cookie — redirect to login
  if (!token) {
    const loginUrl = new URL("/", req.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());

    // User must change password but is trying to access dashboard
    if (payload.mustChangePassword && isDashboard) {
      return NextResponse.redirect(new URL("/change-password", req.url));
    }

    // User already changed password but is on change-password page
    if (!payload.mustChangePassword && isChangePassword) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Superadmin-only routes
    if (pathname.startsWith("/dashboard/students") && payload.role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (pathname.startsWith("/dashboard/courses-manage") && payload.role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid/expired token — clear and redirect to login
    const loginUrl = new URL("/", req.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/change-password"],
};
