import { auth } from "./app/auth";

// Use Auth.js middleware to handle authentication
export default auth;

// Ensure the middleware runs on auth paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - service worker
     */
    "/((?!_next/static|_next/image|favicon.ico|public|sw.js).*)",
  ],
};
