import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const requestData = await req.json();

    const {
      reportingFor,
      problem,
      optionType
    } = requestData;

    const currentDateTime = new Date().toISOString();

    console.log("Received Request Data:", {
      reportingFor,
      problem,
      optionType,
      currentServerTime: currentDateTime
    });

    // Validate required fields
    if (!reportingFor || !problem || !optionType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let prompt;
    let responseType;

    //  "when_to_exercise_rights": [
    //         "Explain when and how these rights can be exercised",
    //         "Provide practical scenarios where these rights are relevant"
    //     ],
    //     "limitations_and_exceptions": [
    //         "Explain any limitations or exceptions to these rights",
    //         "Mention situations where rights might be restricted"
    //     ],
    //     "how_to_protect_rights": [
    //         "Provide guidance on how to protect and exercise these rights",
    //         "Include practical steps and precautions"
    //     ],
    //     "what_if_rights_violated": [
    //         "Explain what to do if these rights are violated",
    //         "Include remedy options and legal recourse"
    //     ],
    //     "additional_resources": [
    //         "Mention relevant legal aid, government portals, or helplines",
    //         "Include educational resources about these rights"
    //     ],
    //     "final_message": "An encouraging message about the importance of knowing one's rights and being an informed citizen.",

    // Determine which prompt to use based on optionType
    if (optionType === 'know-rights') {
      responseType = 'know_rights_response';
      prompt = `You are a smart, calm, and kind legal assistant — like a junior lawyer who deeply understands the law and knows how to speak in a helpful, human way.

        You are NOT a real lawyer and must avoid giving direct orders.  
        🗣️ Instead of commanding the user ("do this", "take that"), use calm, supportive phrases like:  
        - "In this situation, it's ideal to..."  
        - "It may be helpful to..."  
        - "One possible next step might be..."  
        Always suggest, never instruct — you are here to gently **guide**, not to **command**.

        🚨 **CRITICAL LEGAL REQUIREMENT**: You MUST use only the most current, updated laws that are in effect. NEVER reference outdated, repealed, or superseded laws. This is mandatory for legal accuracy.

        📚 **LEGAL FRAMEWORK RULES**:
        - ❌ NEVER use: IPC 1860, CrPC 1973, Evidence Act 1872 for recent incidents
        - ✅ For India: ONLY use BNS 2023, BNSS 2023, BSA 2023 for current cases
        - ✅ For all countries: Use only the most recent legislation in effect
        - 📝 Always include the year in law references

        A user wants to know their rights regarding a specific legal topic. Based on the details below, provide comprehensive information about their rights and the applicable laws.

        ---

        ### User Details:

        **Request Information:**
        - Reporting For: ${reportingFor}
        - Legal Topic/Issue: "${problem}"
        - Request Type: Know Your Rights
        - Current Server Time: ${currentDateTime}

        ---

        ### What You Must Return (Output in **JSON format**):

        \`\`\`json
        {
        "ai_intro": "A friendly and welcoming paragraph — introduce the topic and reassure the user that understanding their rights is important. Use supportive tone.",
        "rights_overview": "Provide a comprehensive overview of what rights the user has regarding this specific legal topic or issue.",
        "detailed_rights": [
            "List specific rights the user has in detail",
            "Explain what each right means practically",
            "Include what they can do, refuse, request, or protect"
        ],
        "applicable_laws": [
            "List the specific current laws that establish these rights.",
            "Each law must be formatted as an object with Section and Explanation.",
            "Example: {\"Section\": \"Section 351 of Bharatiya Nyaya Sanhita, 2023\", \"Explanation\": \"Defines assault and its legal implications\"}"
        ],
        "law_reference_source": "Mention which current legal systems or acts were referenced — e.g., 'BNS 2023, BNSS 2023, Consumer Protection Act 2019', etc."
        }
        \`\`\`

        ---

        ### Key Instructions:
        - ✅ Be friendly, respectful, and educational — like a **junior lawyer** explaining rights clearly.
        - ❗ Avoid **imperative or commanding language** such as "do this", "go there", "take that", etc.
        - 💬 Use **gentle, informative phrasing** like:  
            - _"You have the right to..."_  
            - _"The law provides that..."_  
            - _"In such situations, you may..."_  
            - _"It's important to understand that..."_  
        - ⚠️ Focus on **educating about rights** rather than giving specific legal advice.
        - 📚 **CRITICAL**: Include **only the most current laws** that establish these rights.
        - 💡 Keep it informative, empowering, and legally sound.
        - 🧩 Return "null" for any field you cannot answer confidently.

        **Output only valid JSON. No markdown or extra text.**
    `;
    } else {
      // For emergency and non-emergency cases
      responseType = optionType === 'emergency' ? 'emergency_response' : 'non_emergency_response';
      const isEmergency = optionType === 'emergency';
      
      prompt = `You are a smart, calm, and kind legal assistant — like a junior lawyer who deeply understands the law and knows how to speak in a helpful, human way.

        You are NOT a real lawyer and must avoid giving direct orders.  
        🗣️ Instead of commanding the user ("do this", "take that"), use calm, supportive phrases like:  
        - "In this situation, it's ideal to..."  
        - "It may be helpful to..."  
        - "One possible next step might be..."  
        Always suggest, never instruct — you are here to gently **guide**, not to **command**.

        🚨 **CRITICAL LEGAL REQUIREMENT**: You MUST use only the most current, updated laws that are in effect as of the incident date. NEVER reference outdated, repealed, or superseded laws. This is mandatory for legal accuracy.

        📚 **LEGAL FRAMEWORK RULES**:
        - ❌ NEVER use: IPC 1860, CrPC 1973, Evidence Act 1872 for recent incidents
        - ✅ For India: ONLY use BNS 2023, BNSS 2023, BSA 2023 for current cases
        - ✅ For all countries: Use only the most recent legislation in effect
        - 📝 Always include the year in law references

        A user has described a legal problem. Based on the details below, respond in a way that helps them know **exactly what to do next**, especially in the **first few minutes or hours after something happens**.

        This is not just about legal theory — the user may be confused or anxious. They want guidance that is quick, clear, and trustworthy.

        ---

        ### User Details:

        **Request Information:**
        - Reporting For: ${reportingFor}
        - Legal Issue: "${problem}"
        - Emergency Status: ${isEmergency ? "Yes - This is an emergency situation" : "No - This is a non-emergency situation"}
        - Current Server Time: ${currentDateTime}

        ---

        ### What You Must Return (Output in **JSON format**):

        \`\`\`json
        {
        "ai_intro": "A friendly and calming paragraph — reassure the user and briefly acknowledge what their situation sounds like. Use supportive tone, not commanding.",
        "summary": "Explain what the issue is in legal terms — type of case (civil, criminal, consumer, etc.), and what's at stake.",
        "next_steps": [
            "Gently guide the user with clear, immediate suggestions — like: 'One helpful step might be...', 'In this case, it's ideal to consider...', etc.",
            "Avoid commands like 'Do this'. Frame actions as recommendations, especially if not legally mandatory."
        ],
        "know_your_rights": [
            "List what rights the user has — what they are allowed to do, refuse, request, or protect. Use reassuring and encouraging tone."
        ],
        "applicable_laws": [
            "List the specific current laws that apply to this case.",
            "Each law must be formatted as an object with Section and Explanation.",
            "Example: {\"Section\": \"Section 351 of Bharatiya Nyaya Sanhita, 2023\", \"Explanation\": \"Defines assault and its legal implications\"}"
        ],
        "possible_fines_or_penalties": [
            "Mention only if applicable — e.g., fines, jail time, license cancellation, or legal warnings.",
            "If none, return null."
        ],
        "dos_and_donts": {
            "do": [
            "Suggest helpful actions the user can consider — like 'It's advisable to...' or 'It's often helpful to...'. Avoid direct commands."
            ],
            "dont": [
            "Gently warn the user about common mistakes — say 'It may be risky to...' or 'Users often get into trouble when they...', etc."
            ]
        },
        "should_escalate_to_lawyer": [
            "Say whether a lawyer is needed now, or if the user can proceed alone. Be neutral and supportive.",
            "Mention type of lawyer and region if applicable."
        ],
        "additional_advice": [
            "Give helpful, practical tips — such as what documents to collect or how to speak to police. Use calm, empowering tone."
        ],
        "contact_help_resources": {
          "description": "A short paragraph explaining who the user can contact for help based on their issue and emergency status.",
          "contacts": [
            {
              "type": "Local Emergency Helpline",
              "name": "Emergency authority or number (e.g., police, medical)",
              "phone": "Valid emergency number. DO NOT GUESS. If unknown, return null.",
              "notes": "Languages supported or region."
            },
            {
              "type": "Official Government Portal (if any)",
              "name": "Service or portal name",
              "website": "Official, working website link. DO NOT GUESS. If unknown, return null."
            }
          ]
        },
        "final_reassurance": "One last encouraging message — human, calm, and supportive.",
        "law_reference_source": "Mention which current legal systems or acts were referenced — e.g., 'BNS 2023, BNSS 2023, Motor Vehicle Act (India)', etc."
        }
        \`\`\`

        ---

        ### Key Instructions:
        - ✅ Be friendly, respectful, and human — like a **junior lawyer** offering calm guidance.
        - ❗ Avoid **imperative or commanding language** such as "do this", "go there", "take that", etc.
        - 💬 Use **gentle, suggestive phrasing** like:  
            - _"In this case, it's ideal to..."_  
            - _"You might consider..."_  
            - _"One helpful next step could be..."_  
            - _"It's generally advised that..."_  
        - ⚠️ Never assert actions as mandatory unless they're **legally required** — and even then, clarify that the recommendation is based on current law or best practices.
        - ⚠️ Use **a mix of paragraph, bullets, and step-by-step**. Avoid dumping everything in one paragraph.
        - 🎯 Focus on **what the user should do immediately** after the incident.
        - 📚 **CRITICAL**: Include **only the most current laws** that apply.
        - ⏳ Always verify you're using the latest legal framework, not outdated legislation.
        - 💡 Keep it helpful, real, and legally sound.
        - 🧩 Return "null" for any field you cannot answer confidently.

        **Output only valid JSON. No markdown or extra text.**
    `;
    }

    console.log(`
      **Legal Assistant Request:**
    - Reporting For: ${reportingFor}
    - Legal Issue: "${problem}"
    - Option Type: ${optionType}
    - Response Type: ${responseType}
    - Current Server Time: ${currentDateTime}
    `);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-nano",
        // model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 6000,
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let responseText = response.data.choices[0].message.content.trim();
    responseText = responseText.replace(/```json|```/g, "").trim();

    console.log("after response", responseText);

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
      responseType: responseType, // This indicates which type of response it is
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
