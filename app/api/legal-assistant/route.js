// app/api/legal-assistant/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const requestData = await req.json();
        const { country, state, locality, age, gender, problem, incident_place } = requestData;

        // Validate required fields
        if (!country || !state || !locality || !age || !gender || !problem) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const prompt = `You are a smart, calm, and kind legal assistant — like a junior lawyer who deeply understands the law and knows how to speak in a helpful, human way.

        A user has just described a legal problem. Based on the details below, respond in a way that helps them know **exactly what to do next**, especially in the **first few minutes or hours after something happens**.

        This is not just about legal theory — the user may be confused or anxious. They want guidance that is quick, clear, and trustworthy.

        ---

        ### User Details:
        - Country: ${country}
        - State: ${state}
        - Locality: ${locality}
        - Age: ${age}
        - Gender: ${gender}
        - Legal Issue: "${problem}"
        ${incident_place ? `- Place of Incident: ${incident_place}` : ''}

        ---

        ### What You Must Return (Output in **JSON format**):

        \`\`\`json
        {
        "ai_intro": "A friendly and calming paragraph — reassure the user and briefly acknowledge what their situation sounds like.",
        "summary": "Explain what the issue is in legal terms — type of case (civil, criminal, consumer, etc.), and what's at stake.",
        "next_steps": [
            "List clear, immediate steps the user should take right now.",
            "Include things like filing a complaint, collecting documents, contacting someone, or NOT doing something risky."
        ],
        "know_your_rights": [
            "List what rights the user has — what they are allowed to do, refuse, request, or protect."
        ],
        "applicable_laws": [
            "List relevant laws, sections, and acts with short descriptions.",
            "For India (post-July 1, 2024), include updated laws if applicable:",
            "- Bharatiya Nyaya Sanhita (BNS), 2023",
            "- Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023",
            "- Bharatiya Sakshya Adhiniyam (BSA), 2023",
            "Also include other relevant acts like Motor Vehicle Act, Consumer Protection Act, etc.",
            "For non-Indian users, refer to their national or state laws."
        ],
        "possible_fines_or_penalties": [
            "Mention only if applicable — e.g., fines, jail time, license cancellation, or legal warnings.",
            "If none, return null."
        ],
        "important_warnings": [
            "Cautions to avoid legal mistakes or escalation.",
            "If no specific warning, return null."
        ],
        "should_escalate_to_lawyer": [
            "Say whether a lawyer is needed now, or if the user can proceed alone.",
            "Mention type of lawyer and region if applicable."
        ],
        "additional_advice": [
            "Tips like what documents to collect, how to talk to police, timelines, etc."
        ],
        "final_reassurance": "One last encouraging message — human, calm, and supportive.",
        "law_reference_source": "Mention which legal acts or systems were referenced — e.g., 'BNS, BNSS, Motor Vehicle Act (India)', etc."
        }
        \`\`\`

        ---

        ### Key Instructions:
        - ✅ Be friendly, respectful, and human — like a **junior lawyer** offering calm guidance.
        - ⚠️ Use **a mix of paragraph, bullets, and step-by-step**. Avoid dumping everything in one paragraph.
        - 🎯 Focus on **what the user should do immediately** after the incident.
        - 📚 Include **only laws that actually apply** to the case. Do not force-fit BNS/BNSS/BSA.
        - 🧠 Use **"incident_place"** in your analysis if it's provided. Ignore it if not.
        - 🌍 Adapt to user's country and region accurately.
        - 💡 Keep it helpful, real, and legally sound.
        - 🧩 Return "null" for any field you cannot answer confidently.

        **Output only valid JSON. No markdown or extra text.**
        `;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4.1-nano",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 3000,
                temperature: 0.3,
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

        console.log('AI Response:', responseText);

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

        return NextResponse.json({
            success: true,
            data: legalAdviceData
        });

    } catch (error) {
        console.error("Error in legal assistant API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}