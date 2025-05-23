import { NextRequest, NextResponse } from "next/server";
import { refreshToken } from "../../auth-api";

/**
 * API route to refresh the access token
 * This is needed because we can't directly update the session from client-side code
 */
export async function POST(request: NextRequest) {
  try {
    const { refreshToken: token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Call API to refresh token
    const { data, error } = await refreshToken(token);

    if (error || !data) {
      return NextResponse.json(
        { error: error || "Failed to refresh token" },
        { status: 401 }
      );
    }

    // Return new tokens
    return NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
