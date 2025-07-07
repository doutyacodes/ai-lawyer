// app/api/save-query/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils";
import { LEGAL_QUERIES } from "@/utils/schema";
import { authenticate } from "@/lib/auth-server";

export async function POST(req) {
  try {
    const authResult = await authenticate(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      );
    }

    const userId = authResult.userId;
    const requestData = await req.json();

    const { response_json, responseType, problem } = requestData;

    if (!response_json || !responseType || !problem) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [result] = await db.insert(LEGAL_QUERIES).values({
      user_id: userId,
      problem,
      response_json: {
        ...response_json,
        responseType,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Legal query saved successfully',
        queryId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving legal query:', error);
    return NextResponse.json(
      { error: 'Failed to save legal query' },
      { status: 500 }
    );
  }
}

