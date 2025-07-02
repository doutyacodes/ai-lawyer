// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils";
import { USERS } from "@/utils/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user by username
    const users = await db
      .select()
      .from(USERS)
      .where(eq(USERS.username, username))
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
        { 
        userId: user.id, 
        username: user.username,
        name: user.name 
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const response = NextResponse.json({
        success: true,
        user: {
        id: user.id,
        name: user.name,
        username: user.username,
        }
    });

    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}