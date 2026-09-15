import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, signToken, COOKIE_NAME } from "@/app/_lib/auth/auth";
import { findUserByEmail } from "@/app/_lib/auth/user-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    // Constant-time response to avoid user enumeration
    if (!user || !(await verifyPassword(password, user.hashedPassword))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await signToken({ sub: user.id, email: user.email, name: user.name });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
