// lib/auth-server.js
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function authenticate() {
  try {
    const cookieStore = await cookies(); // ✅ this is now async in App Router
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return { success: false, message: 'No token provided' };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      success: true,
      decoded_Data: decoded,
      userId: decoded.userId,
    };
  } catch (error) {
    return { success: false, message: 'Invalid token' };
  }
}
