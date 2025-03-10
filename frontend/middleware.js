import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log("Middleware triggered for:", req.nextUrl.pathname);

    const path = req.nextUrl.pathname;
    const isAuthenticated = !!req.nextauth.token;

    if (
      [
        "/login",
        "/signup",
        "/api/auth",
        "/api/register",
        "/datadeletion",
        "/reset-password",
      ].some((prefix) => path.startsWith(prefix))
    ) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return null;
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
