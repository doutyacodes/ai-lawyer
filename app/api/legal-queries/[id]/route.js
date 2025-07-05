// api/legal-queries/[id]/route.js

import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { LEGAL_QUERIES } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate } from '@/lib/auth-server';

// Delete a specific query
export async function DELETE(req, { params }) {
    try {
        const authResult = await authenticate();
        if (!authResult.success) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = authResult.userId;
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "Query ID is required" },
                { status: 400 }
            );
        }

        // First, check if the query exists and belongs to the user
        const existingQuery = await db
            .select()
            .from(LEGAL_QUERIES)
            .where(
                and(
                    eq(LEGAL_QUERIES.id, parseInt(id)),
                    eq(LEGAL_QUERIES.user_id, userId)
                )
            );

        if (existingQuery.length === 0) {
            return NextResponse.json(
                { error: "Query not found or you don't have permission to delete it" },
                { status: 404 }
            );
        }

        // Delete the query
        await db
            .delete(LEGAL_QUERIES)
            .where(
                and(
                    eq(LEGAL_QUERIES.id, parseInt(id)),
                    eq(LEGAL_QUERIES.user_id, userId)
                )
            );

        return NextResponse.json({
            success: true,
            message: "Query deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting legal query:", error);
        return NextResponse.json(
            { error: "Failed to delete query" },
            { status: 500 }
        );
    }
}

// Update a specific query (for title editing)
export async function PUT(req, { params }) {
    try {
        const authResult = await authenticate();
        if (!authResult.success) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = authResult.userId;
        const { id } = params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Query ID is required" },
                { status: 400 }
            );
        }

        // Validate that we have a title in the request
        if (!body.hasOwnProperty('title')) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        // Validate title length (optional but recommended)
        if (body.title && body.title.length > 255) {
            return NextResponse.json(
                { error: "Title must be less than 255 characters" },
                { status: 400 }
            );
        }

        // First, check if the query exists and belongs to the user
        const existingQuery = await db
            .select()
            .from(LEGAL_QUERIES)
            .where(
                and(
                    eq(LEGAL_QUERIES.id, parseInt(id)),
                    eq(LEGAL_QUERIES.user_id, userId)
                )
            );

        if (existingQuery.length === 0) {
            return NextResponse.json(
                { error: "Query not found or you don't have permission to update it" },
                { status: 404 }
            );
        }

        // Update the query title
        await db
            .update(LEGAL_QUERIES)
            .set({
                title: body.title,
                updated_at: new Date()
            })
            .where(
                and(
                    eq(LEGAL_QUERIES.id, parseInt(id)),
                    eq(LEGAL_QUERIES.user_id, userId)
                )
            );

        return NextResponse.json({
            success: true,
            message: "Query updated successfully"
        });

    } catch (error) {
        console.error("Error updating legal query:", error);
        return NextResponse.json(
            { error: "Failed to update query" },
            { status: 500 }
        );
    }
}