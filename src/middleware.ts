// middleware.ts

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;
  if (!user && request.nextUrl.pathname !== "/")
    return NextResponse.redirect(new URL("/", request.url));
  else if (user) {
    console.log("user", user);
    const { role } = JSON.parse(user);
    if (request.nextUrl.pathname === "/") {
      switch (role) {
        case "employee":
          return NextResponse.redirect(new URL("/Employee", request.url));
        case "worker":
          return NextResponse.redirect(new URL("/Worker", request.url));
        case "admin":
          return NextResponse.redirect(new URL("/Admin", request.url));
        default:
          return NextResponse.next();
      }
    } else if (request.nextUrl.pathname.startsWith("/Employee")) {
      if (role !== "employee")
        return NextResponse.redirect(new URL("/", request.url));
    } else if (request.nextUrl.pathname.startsWith("/Worker")) {
      if (role !== "worker")
        return NextResponse.redirect(new URL("/", request.url));
    } else if (request.nextUrl.pathname.startsWith("/Admin")) {
      if (role !== "admin")
        return NextResponse.redirect(new URL("/", request.url));
    }
  }

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
