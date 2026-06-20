import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  console.log("Middleware check:", {
    path: req.nextUrl.pathname,
    hasAuth: !!req.auth,
    user: req.auth?.user,
  });
});

export const config = {
  matcher: ["/dashboard/:path*"],
};