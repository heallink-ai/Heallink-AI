import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the token request to the AI Engine service
    const aiEngineUrl =
      process.env.AI_ENGINE_URL || "http://localhost:8000/api/v1";
    const response = await fetch(`${aiEngineUrl}/livekit/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/livekit/token route:", error);
    return NextResponse.json(
      { error: "Failed to get LiveKit token" },
      { status: 500 }
    );
  }
}
