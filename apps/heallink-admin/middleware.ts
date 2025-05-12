import { auth } from "@/app/auth";

export default auth(() => {
  // This middleware is handled by auth.ts authorized callback
});

// Set paths that don't require authentication
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
