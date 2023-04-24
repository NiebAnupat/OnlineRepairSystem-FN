import {NextRequest, NextResponse} from "next/server";
import User from "./models/User";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    try {
        if (!token && request.nextUrl.pathname !== "/") {
            return NextResponse.redirect(new URL("/", request.url));
        } else if (token) {
            const res = await fetch(`${process.env.API_BASE_URL}auth/${token}`);
            if (res.status === 200) {
                const {user_role} = (await res.json()) as User;
                const pathArr = request.nextUrl.pathname.split("/");
                switch (user_role) {
                    case "employee":
                        if (request.nextUrl.pathname === "/") {
                            return NextResponse.redirect(new URL("/Employee", request.url));
                        } else if (pathArr[1] !== "Employee" && pathArr[1] !== 'User') {
                            return NextResponse.redirect(new URL("/", request.url));
                        }
                        break;
                    case "worker":
                        if (request.nextUrl.pathname === "/") {
                            return NextResponse.redirect(new URL("/Worker", request.url));
                        } else if (pathArr[1] !== "Worker" && pathArr[1] !== 'User') {
                            return NextResponse.redirect(new URL("/", request.url));
                        }
                        break;
                    case "admin":
                        if (request.nextUrl.pathname === "/") {
                            return NextResponse.redirect(new URL("/Admin", request.url));
                        } else if (pathArr[1] !== "Admin" && pathArr[1] !== 'User') {
                            return NextResponse.redirect(new URL("/", request.url));
                        }
                        break;
                    default:
                        return NextResponse.next();
                }
            } else {
                // delete token cookie
                const res = NextResponse.redirect(new URL("/", request.url));
                res.cookies.delete("token");
                return res;
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
    api: {
        bodyParser: false,
    },
};
