import { auth } from "./app/auth";

export default auth;

export const config = {
  // Auth.js middleware will be run on all routes in these patterns
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// Force Node.js runtime instead of Edge
export const runtime = "nodejs";
