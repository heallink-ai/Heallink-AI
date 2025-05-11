import { auth } from "./app/auth";

export default auth;

export const config = {
  // Auth.js middleware will be run on all routes in these patterns
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};