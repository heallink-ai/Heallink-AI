import { NextRequest, NextResponse } from "next/server";
import { refreshToken } from "../../auth-api";

/**
 * API route to refresh the access token
 * This is needed because we can't directly update the session from client-side code
 */
export async function POST(request: NextRequest) {
  try {
    // Extract the refresh token from the request body
    const body = await request.json().catch(() => {
      console.error("Failed to parse JSON in refresh token route");
      return {};
    });

    const { refreshToken: token } = body;

    if (!token) {
      console.error("No refresh token provided");
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Call API to refresh token
    const result = await refreshToken(token);

    if (result.error || !result.data) {
      console.error("Token refresh failed:", result.error);
      return NextResponse.json(
        { error: result.error || "Failed to refresh token" },
        { status: 401 }
      );
    }

    // Return new tokens
    return NextResponse.json({
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
