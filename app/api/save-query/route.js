// app/api/save-query/route.js
import { NextResponse } from "next/server";
import { db } from "@/utils";
import { LEGAL_QUERIES } from "@/utils/schema";
import { authenticate } from "@/lib/auth-server";

export async function POST(req) {
    try {
        // Authenticate user
        const authResult = await authenticate(req);
        if (!authResult.success) {
            return NextResponse.json(
                { error: "Authentication required", requiresAuth: true },
                { status: 401 }
            );
        }
        console.log("authresult", authResult)
        const userId = authResult.userId;
        const requestData = await req.json();

        const { 
            country, 
            state, 
            locality, 
            incident_place, 
            age, 
            gender, 
            problem, 
            response_json 
        } = requestData;

        // Validate required fields
        if (!country || !state || !locality || !age || !gender || !problem || !response_json) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save to database
        const [result] = await db.insert(LEGAL_QUERIES).values({
            user_id: userId,
            country,
            state,
            locality,
            incident_place: incident_place || null,
            age: parseInt(age),
            gender,
            problem,
            response_json: response_json
        });

        return NextResponse.json({
            success: true,
            message: "Legal query saved successfully",
            queryId: result.insertId
        }, { status: 201 });

    } catch (error) {
        console.error("Error saving legal query:", error);
        return NextResponse.json(
            { error: "Failed to save legal query" },
            { status: 500 }
        );
    }
}