import { NextResponse } from "next/server";
import { isValidSessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/products/:path*"],
};

export async function proxy(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await isValidSessionToken(token);

  if (!valid) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
