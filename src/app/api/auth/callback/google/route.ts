import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/auditLogger";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const isProd = host.includes("ipem10.edu.ar");
  const redirectUri = isProd
    ? "https://ipem10.edu.ar/api/auth/callback/google"
    : "http://localhost:3000/api/auth/callback/google";
  const origin = isProd ? "https://ipem10.edu.ar" : "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(new URL("/acceso-institucional?error=codigo_invalido", origin));
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Error detallado de Google OAuth:", tokenData);
      return NextResponse.redirect(new URL("/acceso-institucional?error=falla_google", origin));
    }

    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userinfoResponse.json();
    const email = googleUser.email?.toLowerCase().trim();

    if (!email || (!email.endsWith("@ipem10.edu.ar") && email !== "rpereyra.ipem10@gmail.com")) {
      await logSecurityEvent({
        severity: "HIGH",
        action: "GOOGLE_AUTH_UNAUTHORIZED_DOMAIN",
        category: "AUTH",
        status: "FAILED",
        actorId: email || "desconocido",
      });
      return NextResponse.redirect(new URL("/acceso-institucional?error=dominio_no_autorizado", origin));
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      await logSecurityEvent({
        severity: "MEDIUM",
        action: "GOOGLE_AUTH_UNREGISTERED_USER",
        category: "AUTH",
        status: "FAILED",
        actorId: email,
      });
      return NextResponse.redirect(new URL("/acceso-institucional?error=sin_permisos", origin));
    }

    if (!user.active) {
      return NextResponse.redirect(new URL("/acceso-institucional?error=cuenta_suspendida", origin));
    }

    await logSecurityEvent({
      severity: user.role === "MASTER" ? "MEDIUM" : "LOW",
      action: "GOOGLE_AUTH_SUCCESS",
      category: "AUTH",
      status: "SUCCESS",
      actorId: user.id,
      actorRole: user.role,
      targetResource: `user:${user.id}`,
    });

    await createSession({
      userId: user.id,
      role: user.role as any,
      fullName: user.fullName || googleUser.name,
    });

    if (user.role === "DOCENTE") return NextResponse.redirect(new URL("/docentes", origin));
    if (user.role === "PRECEPTOR") return NextResponse.redirect(new URL("/preceptoria", origin));
    return NextResponse.redirect(new URL("/admin", origin));
  } catch (error) {
    console.error("Error en callback de Google:", error);
    return NextResponse.redirect(new URL("/acceso-institucional?error=error_interno", origin));
  }
}
