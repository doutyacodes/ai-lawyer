// app/api/generate-legal-advice/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const { country, state, age, gender, problem } = await req.json();

        // Input validation
        if (!country || !age || !gender || !problem) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Construct the prompt
        const prompt = `You are an AI legal assistant. Based on the following case details:
            Country: ${country}
            State: ${state}
            Age: ${age}
            Gender: ${gender}
            Issue: "${problem}"

            Provide a detailed legal analysis in this exact JSON format:
            {
              "problem": "Clear restatement of the issue in legal terms, identifying all key legal aspects that need to be addressed",
              "rules_and_procedures": "Comprehensive explanation of ALL applicable laws, regulations, and specific procedures that apply to this situation in ${country} and ${state}. Include relevant statutory references, key legal rights, required steps, time limits, and specific actions the person should take."
            }`


        // "references": [
        //         "Cite specific legal acts, sections, or precedents, if applicable."
        //     ],
        //     "action_plan": {
        //         "immediate_actions": "List immediate steps the user should take.",
        //         "long_term_solutions": "Propose long-term resolutions."
        //     }

        // Make request to OpenAI API
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                // temperature: 0.5, // Balance between creative and factual
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Parse the response
        let responseText = response.data.choices[0].message.content.trim();
        responseText = responseText.replace(/```json|```/g, "").trim();

        let legalAdviceData;
        try {
            legalAdviceData = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Error parsing JSON response:", jsonError);
            return NextResponse.json(
                { error: "Failed to parse the legal advice response" },
                { status: 500 }
            );
        }

        // Return the legal advice
        return NextResponse.json({ content: legalAdviceData }, { status: 200 });
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);

        return NextResponse.json(
            {
                error: "Failed to generate legal advice",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
