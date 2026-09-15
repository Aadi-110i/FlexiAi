import { NextRequest, NextResponse } from "next/server";
import { hashPassword, signToken } from "@/app/_lib/auth/auth";
import { createUser, findUserByEmail } from "@/app/_lib/auth/user-store";
import { COOKIE_NAME } from "@/app/_lib/auth/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name?: string; email?: string; password?: string };
    const { name, email, password } = body;

    // ── Validation ─────────────────────────────────────────

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // ── Create user ─────────────────────────────────────────

    const hashedPassword = await hashPassword(password);
    const user = createUser(email.trim(), name.trim(), hashedPassword);
    const token = await signToken({ sub: user.id, email: user.email, name: user.name });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
