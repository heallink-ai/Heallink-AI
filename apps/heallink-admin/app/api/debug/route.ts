import { NextResponse } from "next/server";

export async function GET() {
  // Get both API URLs for testing
  const publicApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";
  const serverApiUrl = process.env.API_URL || "http://api:3003/api/v1";

  console.log("Testing API connections:");
  console.log("- Public API URL:", publicApiUrl);
  console.log("- Server API URL:", serverApiUrl);

  const results = {
    publicApi: {
      success: false as boolean,
      error: null as string | null,
      data: null as string | null,
    },
    serverApi: {
      success: false as boolean,
      error: null as string | null,
      data: null as string | null,
    },
    environment: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      API_URL: process.env.API_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
  };

  // Test public API URL
  try {
    console.log("Starting public API test to:", publicApiUrl);
    const publicResponse = await fetch(publicApiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
      cache: "no-store",
    });

    const responseText = await publicResponse.text();
    results.publicApi.data = responseText;
    results.publicApi.success = publicResponse.ok;

    console.log("Public API test result:", {
      status: publicResponse.status,
      data: results.publicApi.data,
    });
  } catch (error) {
    console.error("Public API test failed:", error);
    results.publicApi.error =
      error instanceof Error ? error.message : "Unknown error";
  }

  // Test server API URL
  try {
    console.log("Starting server API test to:", serverApiUrl);
    const serverResponse = await fetch(serverApiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
      cache: "no-store",
    });

    const responseText = await serverResponse.text();
    results.serverApi.data = responseText;
    results.serverApi.success = serverResponse.ok;

    console.log("Server API test result:", {
      status: serverResponse.status,
      data: results.serverApi.data,
    });
  } catch (error) {
    console.error("Server API test failed:", error);
    results.serverApi.error =
      error instanceof Error ? error.message : "Unknown error";
  }

  return NextResponse.json(results);
}
