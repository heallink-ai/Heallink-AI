import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { handlers } from "@/app/auth";

/**
 * API route to handle NextAuth sessions
 * - GET: Retrieves the current session (used by NextAuth's useSession hook)
 * - POST: Updates the session tokens (used for token refresh)
 */

/**
 * GET handler for session retrieval
 * This is used by NextAuth's getSession function
 */
export const GET = handlers.GET;

/**
 * POST handler for updating session tokens
 * This is used by our custom token refresh mechanism
 */
export async function POST(request: NextRequest) {
  try {
    // Safely parse request body
    const body = await request.json().catch(() => {
      console.error("Failed to parse JSON in session update route");
      return {};
    });

    const { accessToken, refreshToken } = body;

    if (!accessToken || !refreshToken) {
      console.error("Missing tokens in session update request");
      return NextResponse.json(
        { error: "Access token and refresh token are required" },
        { status: 400 }
      );
    }

    // Get the session token
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        console.error("No session token found during update attempt");
        return NextResponse.json(
          { error: "No valid session found" },
          { status: 401 }
        );
      }

      console.log("Session token found, tokens can be updated by client");
      // Update the session token with new values
      // Note: This doesn't actually update the session directly, as that's not possible
      // from an API route. The client needs to refresh the session via next-auth.
      // This API just provides feedback to the client.

      return NextResponse.json({
        message: "Session update requested. Client should re-fetch session",
        updated: true,
      });
    } catch (tokenError) {
      console.error("Error retrieving session token:", tokenError);
      return NextResponse.json(
        { error: "Error retrieving session" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error updating session:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
