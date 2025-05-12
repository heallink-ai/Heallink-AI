import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "API test endpoint working",
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
  });
}
