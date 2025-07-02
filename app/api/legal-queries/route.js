import { NextResponse } from "next/server";
import { db } from "@/utils";
import { LEGAL_QUERIES } from "@/utils/schema";
import { authenticate } from "@/lib/auth-server";
import { desc, eq, sql } from "drizzle-orm";

// Get user's saved queries
export async function GET(req) {
    try {
        const authResult = await authenticate();
        if (!authResult.success) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = authResult.userId;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 10;
        const offset = parseInt(searchParams.get('offset')) || 0;

            // ✅ Get total count for pagination
            const totalCountResult = await db
            .select({ count: sql`COUNT(*)` })
            .from(LEGAL_QUERIES)
            .where(eq(LEGAL_QUERIES.user_id, userId));

            const totalCount = Number(totalCountResult[0].count);

            // ✅ Get paginated results
            const queries = await db
            .select()
            .from(LEGAL_QUERIES)
            .where(eq(LEGAL_QUERIES.user_id, userId))
            .orderBy(desc(LEGAL_QUERIES.created_at))
            .limit(limit)
            .offset(offset);

    // ✅ Send total count with data
    return NextResponse.json({
        success: true,
        data: queries,
        total: totalCount,
    });
} catch (error) {
        console.error("Error fetching legal queries:", error);
        return NextResponse.json(
            { error: "Failed to fetch legal queries" },
            { status: 500 }
        );
    }
}