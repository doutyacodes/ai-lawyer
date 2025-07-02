// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils";
import { USERS } from "@/utils/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, username, password } = await req.json();

    // Validate input
    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Name, username, and password are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsers = await db
      .select()
      .from(USERS)
      .where(eq(USERS.username, username))
      .limit(1);

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    await db.insert(USERS).values({
    name: name.trim(),
    username: username.trim(),
    password: hashedPassword,
    });

    const newUser = await db
    .select()
    .from(USERS)
    .where(eq(USERS.username, username.trim()));

    const token = jwt.sign(
    {
    userId: newUser[0].id,
    username: newUser[0].username,
    name: newUser[0].name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
    );

    // Set the token as a secure cookie
    const response = NextResponse.json({
        success: true,
        user: {
        id: newUser[0].id,
        name: newUser[0].name,
        username: newUser[0].username,
        },
    });

    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only HTTPS in production
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}