import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  // If user tries dashboard without login
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user visits /dashboard → redirect based on role
  if (pathname === "/dashboard") {
    if (role === "business") {
      return NextResponse.redirect(new URL("/dashboard/business", request.url));
    }

    if (role === "expert") {
      return NextResponse.redirect(new URL("/dashboard/expert", request.url));
    }
  }

  // Prevent expert accessing business dashboard
  if (pathname.startsWith("/dashboard/business") && role !== "business") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Prevent business accessing expert dashboard
  if (pathname.startsWith("/dashboard/expert") && role !== "expert") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
