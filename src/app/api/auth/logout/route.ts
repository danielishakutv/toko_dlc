import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    authenticate(req);
  } catch {
    // Already logged out or invalid token — still clear cookie
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
