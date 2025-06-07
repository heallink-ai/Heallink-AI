import { NextRequest, NextResponse } from "next/server";
import { registerProvider } from "../../auth-api";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.password || !data.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Register the provider with our API
    const result = await registerProvider({
      email: data.email,
      name: data.name,
      password: data.password,
      specialization: data.specialty,
      licenseNumber: data.licenseNumber,
    });

    // Handle error response
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode || 500 }
      );
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: "Registration successful. Please sign in.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
