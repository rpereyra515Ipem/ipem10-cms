import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Falta GOOGLE_CLIENT_ID en .env.local" }, { status: 500 });
  }

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const redirectUri = host.includes("ipem10.edu.ar")
    ? "https://ipem10.edu.ar/api/auth/callback/google"
    : "http://localhost:3000/api/auth/callback/google";

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(googleAuthUrl.toString());
}
