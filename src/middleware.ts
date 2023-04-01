// middleware.ts

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "./models/User";
import { useUserStore } from "./lib/userStore";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  try {
    if (!token && request.nextUrl.pathname !== "/")
      return NextResponse.redirect(new URL("/", request.url));
    else if (token) {
      const res = await fetch(`http://localhost:4000/auth/${token}`);
      if (res.status === 200) {
        const {user_role} = (await res.json()) as User;
        if (request.nextUrl.pathname === "/") {
          switch (user_role) {
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
          if (user_role !== "employee")
            return NextResponse.redirect(new URL("/", request.url));
        } else if (request.nextUrl.pathname.startsWith("/Worker")) {
          if (user_role !== "worker")
            return NextResponse.redirect(new URL("/", request.url));
        } else if (request.nextUrl.pathname.startsWith("/Admin")) {
          if (user_role !== "admin")
            return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }
  } catch (error) {
    console.log(error);
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
