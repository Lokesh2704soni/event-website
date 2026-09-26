import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

const secretKey = secret
  ? new TextEncoder().encode(secret)
  : null;

async function isAuthenticated(request: NextRequest) {
  if (!secretKey) {
    return false;
  }

  const token = request.cookies.get("admin_session")?.value;

  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminPage =
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login";

  if (!isAdminPage) {
    return NextResponse.next();
  }

  const authenticated = await isAuthenticated(request);

  if (!authenticated) {
    const loginUrl = new URL(
      "/admin/login",
      request.url
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};