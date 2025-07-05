// app/api/legal-assistant/route.js
import { NextResponse } from "next/server";
import axios from "axios";

// export async function POST(req) {
//     try {
//         const requestData = await req.json();
//         const { country, state, locality, age, gender, problem, incident_place } = requestData;

//         // Validate required fields
//         if (!country || !state || !locality || !age || !gender || !problem) {
//             return NextResponse.json(
//                 { error: "Missing required fields" },
//                 { status: 400 }
//             );
//         }

//         const prompt = `You are a smart, calm, and kind legal assistant — like a junior lawyer who deeply understands the law and knows how to speak in a helpful, human way.

//         A user has just described a legal problem. Based on the details below, respond in a way that helps them know **exactly what to do next**, especially in the **first few minutes or hours after something happens**.

//         This is not just about legal theory — the user may be confused or anxious. They want guidance that is quick, clear, and trustworthy.

//         ---

//         ### User Details:
//         - Country: ${country}
//         - State: ${state}
//         - Locality: ${locality}
//         - Age: ${age}
//         - Gender: ${gender}
//         - Legal Issue: "${problem}"
//         ${incident_place ? `- Place of Incident: ${incident_place}` : ''}

//         ---

//         ### What You Must Return (Output in **JSON format**):

//         \`\`\`json
//         {
//         "ai_intro": "A friendly and calming paragraph — reassure the user and briefly acknowledge what their situation sounds like.",
//         "summary": "Explain what the issue is in legal terms — type of case (civil, criminal, consumer, etc.), and what's at stake.",
//         "next_steps": [
//             "List clear, immediate steps the user should take right now.",
//             "Include things like filing a complaint, collecting documents, contacting someone, or NOT doing something risky."
//         ],
//         "know_your_rights": [
//             "List what rights the user has — what they are allowed to do, refuse, request, or protect."
//         ],
//         "applicable_laws": [
//             "List relevant laws, sections, and acts with short descriptions.",
//             "For India (post-July 1, 2024), include updated laws if applicable:",
//             "- Bharatiya Nyaya Sanhita (BNS), 2023",
//             "- Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023",
//             "- Bharatiya Sakshya Adhiniyam (BSA), 2023",
//             "Also include other relevant acts like Motor Vehicle Act, Consumer Protection Act, etc.",
//             "For non-Indian users, refer to their national or state laws."
//         ],
//         "possible_fines_or_penalties": [
//             "Mention only if applicable — e.g., fines, jail time, license cancellation, or legal warnings.",
//             "If none, return null."
//         ],
//         "important_warnings": [
//             "Cautions to avoid legal mistakes or escalation.",
//             "If no specific warning, return null."
//         ],
//         "should_escalate_to_lawyer": [
//             "Say whether a lawyer is needed now, or if the user can proceed alone.",
//             "Mention type of lawyer and region if applicable."
//         ],
//         "additional_advice": [
//             "Tips like what documents to collect, how to talk to police, timelines, etc."
//         ],
//         "final_reassurance": "One last encouraging message — human, calm, and supportive.",
//         "law_reference_source": "Mention which legal acts or systems were referenced — e.g., 'BNS, BNSS, Motor Vehicle Act (India)', etc."
//         }
//         \`\`\`

//         ---

//         ### Key Instructions:
//         - ✅ Be friendly, respectful, and human — like a **junior lawyer** offering calm guidance.
//         - ⚠️ Use **a mix of paragraph, bullets, and step-by-step**. Avoid dumping everything in one paragraph.
//         - 🎯 Focus on **what the user should do immediately** after the incident.
//         - 📚 Include **only laws that actually apply** to the case. Do not force-fit BNS/BNSS/BSA.
//         - 🧠 Use **"incident_place"** in your analysis if it's provided. Ignore it if not.
//         - 🌍 Adapt to user's country and region accurately.
//         - 💡 Keep it helpful, real, and legally sound.
//         - 🧩 Return "null" for any field you cannot answer confidently.

//         **Output only valid JSON. No markdown or extra text.**
//         `;

//         const response = await axios.post(
//             "https://api.openai.com/v1/chat/completions",
//             {
//                 model: "gpt-4.1-nano",
//                 messages: [{ role: "user", content: prompt }],
//                 max_tokens: 3000,
//                 temperature: 0.3,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         // Parse the response
//         let responseText = response.data.choices[0].message.content.trim();
//         responseText = responseText.replace(/```json|```/g, "").trim();

//         console.log('AI Response:', responseText);

//         let legalAdviceData;
//         try {
//             legalAdviceData = JSON.parse(responseText);
//         } catch (jsonError) {
//             console.error("Error parsing JSON response:", jsonError);
//             return NextResponse.json(
//                 { error: "Failed to parse the legal advice response" },
//                 { status: 500 }
//             );
//         }

//         return NextResponse.json({
//             success: true,
//             data: legalAdviceData
//         });

//     } catch (error) {
//         console.error("Error in legal assistant API:", error);
//         return NextResponse.json(
//             { error: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }

export async function POST(req) {
  try {
    const requestData = await req.json();

    const {
      nationality,
      age,
      gender,
      religion,
      country,
      state,
      locality,
      incident_place,
      problem,
      isEmergency,
      dateTime,
      isInjuredOrThreatened,
      isVehicleInvolved,
      vehicleDetails,
      statusInCountry
    } = requestData;

    const currentDateTime = new Date().toISOString();

    const nationalityDiffers = nationality !== country.name;
    const statusNote = nationalityDiffers && statusInCountry
      ? `The user is currently in ${country.name} but their nationality is ${nationality}. They mentioned their reason for being in ${country.name} is: "${statusInCountry.startsWith('other:') ? statusInCountry.slice(6) : statusInCountry}". Consider any legal implications that may apply to non-citizens.`
      : '';

    console.log("Received Request Data:", {
      nationality,
      age,
      gender,
      religion,
      country: country.name,
      state: state.name,
      locality,
      incident_place,
      problem,
      isEmergency,
      dateTime,
      isInjuredOrThreatened,
      isVehicleInvolved,
      vehicleDetails,
      currentServerTime: currentDateTime,
      statusInCountry: nationalityDiffers ? statusInCountry : null
    });

    // Validate required fields
    if (!nationality || !age || !gender || !country || !state || !dateTime || !problem) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`
      **Person Seeking Help:**
    - Nationality: ${nationality}
    - Age: ${age}
    - Gender: ${gender}
    - Religion: ${religion || "Not specified"}

    **Incident Details:**
    - Country: ${country.name}
    - State: ${state.name}
    - Locality: ${locality || "Not specified"}
    - Place of Incident: ${incident_place || "Not specified"}
    - Legal Issue: "${problem}"
    - Date & Time of Event: ${dateTime || "Not specified"}
    - Current Server Time: ${currentDateTime}

    ${statusNote}

    **Additional Emergency Info (if provided):**
    - Emergency: ${isEmergency === null ? "Not specified" : isEmergency ? "Yes" : "No"}
    - Injured or Threatened: ${isInjuredOrThreatened === null ? "Not specified" : isInjuredOrThreatened ? "Yes" : "No"}
    - Vehicle Involved: ${isVehicleInvolved === null ? "Not specified" : isVehicleInvolved ? "Yes" : "No"}
    - Vehicle Details: ${vehicleDetails || "Not specified"}
`)

    // Final Prompt Construction
    // const prompt = `You are a smart, calm, and kind legal assistant — like a junior lawyer who deeply understands the law and knows how to speak in a helpful, human way.

    // A user has just described a legal problem. Based on the details below, respond in a way that helps them know **exactly what to do next**, especially in the **first few minutes or hours after something happens**.

    // This is not just about legal theory — the user may be confused or anxious. They want guidance that is quick, clear, and trustworthy.

    // ---

    // ### User Details:

    // **Person Seeking Help:**
    // - Nationality: ${nationality}
    // - Age: ${age}
    // - Gender: ${gender}
    // - Religion: ${religion || "Not specified"}

    // **Incident Details:**
    // - Country: ${country.name}
    // - State: ${state.name}
    // - Locality: ${locality || "Not specified"}
    // - Place of Incident: ${incident_place || "Not specified"}
    // - Legal Issue: "${problem}"
    // - Date & Time of Event: ${dateTime || "Not specified"}
    // - Current Server Time: ${currentDateTime}

    // ${statusNote}

    // **Additional Emergency Info (if provided):**
    // - Emergency: ${isEmergency === null ? "Not specified" : isEmergency ? "Yes" : "No"}
    // - Injured or Threatened: ${isInjuredOrThreatened === null ? "Not specified" : isInjuredOrThreatened ? "Yes" : "No"}
    // - Vehicle Involved: ${isVehicleInvolved === null ? "Not specified" : isVehicleInvolved ? "Yes" : "No"}
    // - Vehicle Details: ${vehicleDetails || "Not specified"}

    // ---

    // ### What You Must Return (Output in **JSON format**):

    // \`\`\`json
    // {
    // "ai_intro": "A friendly and calming paragraph — reassure the user and briefly acknowledge what their situation sounds like.",
    // "summary": "Explain what the issue is in legal terms — type of case (civil, criminal, consumer, etc.), and what's at stake.",
    // "next_steps": [
    //     "List clear, immediate steps the user should take right now.",
    //     "Include things like filing a complaint, collecting documents, contacting someone, or NOT doing something risky."
    // ],
    // "know_your_rights": [
    //     "List what rights the user has — what they are allowed to do, refuse, request, or protect."
    // ],
    // "applicable_laws": [
    //     "List the most relevant, current laws and legal provisions applicable in the region where the incident occurred.",
    //     "Return as an array of objects with exact structure:",
    //     "CRITICAL: Use ONLY current, valid laws based on incident date:",
    //     "- For Indian cases after July 1, 2024: Use BNS (Bharatiya Nyaya Sanhita), BNSS (Bharatiya Nagarik Suraksha Sanhita), BSA (Bharatiya Sakshya Adhiniyam)",
    //     "- For Indian cases before July 1, 2024: Use IPC, CrPC, Indian Evidence Act",
    //     "- NEVER mix old and new laws - determine the applicable legal framework based on incident date",
    //     "- If incident date is unclear, ask for clarification or assume current date",
    //     "Each law object must have exactly this structure:",
    //     "{",
    //     "  \"Section\": \"Exact Section Number and Name (e.g., Section 351 of Bharatiya Nyaya Sanhita, 2023)\",",
    //     "  \"Explanation\": \"A short, clear explanation in simple words of what the law means and why it applies to this case\"",
    //     "}",
    //     "Do not reference repealed, outdated, or invalid laws for the given time period.",
    //     "Avoid vague references — be specific and accurate with section numbers and law names."
    // ],
    // "possible_fines_or_penalties": [
    //     "Mention only if applicable — e.g., fines, jail time, license cancellation, or legal warnings.",
    //     "If none, return null."
    // ],
    // "dos_and_donts": {
    //     "do": [
    //     "List specific, practical actions the user should definitely take — like reporting to the police, collecting medical evidence, etc."
    //     ],
    //     "dont": [
    //     "List common mistakes or risky behaviors to avoid — like threatening someone, posting online, or ignoring summons."
    //     ]
    // },
    // "should_escalate_to_lawyer": [
    //     "Say whether a lawyer is needed now, or if the user can proceed alone.",
    //     "Mention type of lawyer and region if applicable."
    // ],
    // "additional_advice": [
    //     "Tips like what documents to collect, how to talk to police, timelines, etc."
    // ],
    // "contact_help_resources": {
    //   "description": "A short paragraph explaining who the user can contact for help based on their location, nationality, and issue.",
    //   "contacts": [
    //     {
    //       "type": "Embassy or Consulate",
    //       "name": "Name of embassy or consulate (if relevant)",
    //       "website": "Official, working website",
    //       "email": "Email if publicly available",
    //       "phone": "International phone number",
    //       "notes": "Operating hours or notes, if available"
    //     },
    //     {
    //       "type": "Local Emergency Helpline",
    //       "name": "Emergency authority or number (e.g., police, medical)",
    //       "phone": "Valid emergency number",
    //       "notes": "Languages supported or region"
    //     },
    //     {
    //       "type": "Official Government Portal (if any)",
    //       "name": "Service or portal name",
    //       "website": "Working official link"
    //     }
    //   ]
    // },
    // "final_reassurance": "One last encouraging message — human, calm, and supportive.",
    // "law_reference_source": "Mention which legal systems or acts were referenced — e.g., 'BNS, BNSS, Motor Vehicle Act (India)', etc."
    // }
    // \`\`\`

    // ---

    // ### Key Instructions:
    // - ✅ Be friendly, respectful, and human — like a **junior lawyer** offering calm guidance.
    // - ⚠️ Use **a mix of paragraph, bullets, and step-by-step**. Avoid dumping everything in one paragraph.
    // - 🎯 Focus on **what the user should do immediately** after the incident.
    // - 📚 Include **only updated laws** that apply in the region and time of the incident.
    // - 🧠 Use **Nationality** and **Incident Location** to shape the response.
    // - ⏳ Carefully apply the correct law set depending on **incident_date**.
    // - 💡 Keep it helpful, real, and legally sound.
    // - 🧩 Return "null" for any field you cannot answer confidently.

    // 🌐 For "contact_help_resources", follow this logic strictly:

    // - 📍 If the **incident happened in the user's own country** (e.g., Indian citizen in India):
    //   - ✅ Only return **local or regional help sources**:
    //     - National emergency numbers (e.g., 112, 100, 1091)
    //     - State legal aid boards, police portals, citizen grievance systems
    //     - City or state helplines, if specific (e.g., Delhi Police)
    //   - ❌ Do NOT include any embassy or consulate information.

    // - 🌍 If the **incident occurred outside the user's country of nationality** (e.g., Indian in UAE):
    //   - ✅ Return:
    //     - The **user's home country embassy or consulate** in the foreign country
    //     - Local emergency numbers of the country where the incident happened
    //     - If available, official Indian portals like **MADAD** for cross-border legal or emergency assistance

    // - ⚖️ If it's a **cross-border legal situation** (e.g., Indian arrested abroad or lost passport overseas):
    //   - ✅ Prioritize verified contacts from **both countries involved** (home + foreign)
    //   - ✅ Only include embassy contacts if they're **relevant to the case context**

    // - 🔍 All contact details must be:
    //   - Official (from government or legitimate authority)
    //   - Verifiable (do NOT generate or assume websites, emails, or phone numbers)
    //   - Mark missing fields as 'null' — **never invent anything**


    // **Output only valid JSON. No markdown or extra text.**
    // `;



    //"applicable_laws": [
    //     "CRITICAL: Only provide CURRENT, VALID laws that are in effect as of the incident date which is ${dateTime}.",
    //     "Research and verify that all laws mentioned are still active and not repealed or superseded.",
    //     "For ANY country, automatically determine and use the most recent version of applicable laws:",
    //     "- Always check if laws have been updated, amended, or replaced since the incident date",
    //     "- Use the legal framework that was active during the incident period of ${dateTime}", 
    //     "- If multiple versions exist, use the one applicable to the incident timeframe",
    //     "- Prioritize primary legislation over secondary rules or outdated codes",
    //     "Each law object must have exactly this structure:",
    //     "{",
    //     "  \"Section\": \"Exact current section number and full law name with year (format: Section X of [Law Name], [Year])\",",
    //     "  \"Explanation\": \"Clear explanation of what this current law means and how it applies to this specific case\"",
    //     "}",
    //     "NEVER reference repealed, outdated, superseded, or invalid laws.",
    //     "If unsure about current status of a law, mark as 'Verification needed' rather than guessing.",
    //     "Always include the year of the law to show it's current."
    // ],

    // Final Prompt Construction
    const prompt = `You are a smart, calm, and kind legal assistant — like a junior lawyer who deeply understands the law and knows how to speak in a helpful, human way.

        🚨 **CRITICAL LEGAL REQUIREMENT**: You MUST use only the most current, updated laws that are in effect as of the incident date. NEVER reference outdated, repealed, or superseded laws. This is mandatory for legal accuracy.

        📚 **LEGAL FRAMEWORK RULES**:
        - ❌ NEVER use: IPC 1860, CrPC 1973, Evidence Act 1872 for recent incidents
        - ✅ For India: ONLY use BNS 2023, BNSS 2023, BSA 2023 for current cases
        - ✅ For all countries: Use only the most recent legislation in effect
        - 📝 Always include the year in law references

        A user has just described a legal problem. Based on the details below, respond in a way that helps them know **exactly what to do next**, especially in the **first few minutes or hours after something happens**.

        This is not just about legal theory — the user may be confused or anxious. They want guidance that is quick, clear, and trustworthy.

        ---

        ### User Details:

        **Person Seeking Help:**
        - Nationality: ${nationality}
        - Age: ${age}
        - Gender: ${gender}
        - Religion: ${religion || "Not specified"}

        **Incident Details:**
        - Country: ${country.name}
        - State: ${state.name}
        - Locality: ${locality || "Not specified"}
        - Place of Incident: ${incident_place || "Not specified"}
        - Legal Issue: "${problem}"
        - Date & Time of Event: ${dateTime || "Not specified"}
        - Current Server Time: ${currentDateTime}

        ${statusNote}

        **Additional Emergency Info (if provided):**
        - Emergency: ${isEmergency === null ? "Not specified" : isEmergency ? "Yes" : "No"}
        - Injured or Threatened: ${isInjuredOrThreatened === null ? "Not specified" : isInjuredOrThreatened ? "Yes" : "No"}
        - Vehicle Involved: ${isVehicleInvolved === null ? "Not specified" : isVehicleInvolved ? "Yes" : "No"}
        - Vehicle Details: ${vehicleDetails || "Not specified"}

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
        
    📚 **LEGAL FRAMEWORK RULES**:
          - ❌ NEVER use: IPC(Indian Penal Code) 1860, CrPC(Code of Criminal Procedure) 1973, Evidence Act 1872 for recent incidents
          - ✅ For India: Use BNS 2023, BNSS 2023, BSA 2023 PLUS other current laws but never use IPC(Indian Penal Code) 1860, CrPC(Code of Criminal Procedure) 1973, Evidence Act 1872 for recent incidents
          - ✅ Any other applicable current legislation like Motor Vehicle Act, 1988 (current amendments), Consumer Protection Act, 2019, Information Technology Act, 2000 (current amendments,  Labour laws (current versions), Property laws (current versions), but never use IPC(Indian Penal Code) 1860, CrPC(Code of Criminal Procedure) 1973, Evidence Act 1872 for recent incidents
          - ✅ For other countries: Use ONLY that country's current laws (not Indian laws)
          - 📝 Always include the year in law references to show currency
          - 🌍 Match laws to the INCIDENT COUNTRY, not user's nationality
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
            "List specific, practical actions the user should definitely take — like reporting to the police, collecting medical evidence, etc."
            ],
            "dont": [
            "List common mistakes or risky behaviors to avoid — like threatening someone, posting online, or ignoring summons."
            ]
        },
        "should_escalate_to_lawyer": [
            "Say whether a lawyer is needed now, or if the user can proceed alone.",
            "Mention type of lawyer and region if applicable."
        ],
        "additional_advice": [
            "Tips like what documents to collect, how to talk to police, timelines, etc."
        ],
        "contact_help_resources": {
          "description": "A short paragraph explaining who the user can contact for help based on their location, nationality, and issue.",
          "contacts": [
            {
              "type": "Embassy or Consulate",
              "name": "Name of embassy or consulate (if relevant)",
              "website": "Official, working website",
              "email": "Email if publicly available",
              "phone": "International phone number",
              "notes": "Operating hours or notes, if available"
            },
            {
              "type": "Local Emergency Helpline",
              "name": "Emergency authority or number (e.g., police, medical)",
              "phone": "Valid emergency number",
              "notes": "Languages supported or region"
            },
            {
              "type": "Official Government Portal (if any)",
              "name": "Service or portal name",
              "website": "Working official link"
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
        - ⚠️ Use **a mix of paragraph, bullets, and step-by-step**. Avoid dumping everything in one paragraph.
        - 🎯 Focus on **what the user should do immediately** after the incident.
        - 📚 **CRITICAL**: Include **only the most current laws** that apply in the region and time of the incident.
        - 🧠 Use **Nationality** and **Incident Location** to shape the response.
        - ⏳ Always verify you're using the latest legal framework, not outdated legislation.
        - 💡 Keep it helpful, real, and legally sound.
        - 🧩 Return "null" for any field you cannot answer confidently.

        🌐 For "contact_help_resources", follow this logic strictly:

        - 📍 If the **incident happened in the user's own country** (e.g., Indian citizen in India):
          - ✅ Only return **local or regional help sources**:
            - National emergency numbers (e.g., 112, 100, 1091)
            - State legal aid boards, police portals, citizen grievance systems
            - City or state helplines, if specific (e.g., Delhi Police)
          - ❌ Do NOT include any embassy or consulate information.

        - 🌍 If the **incident occurred outside the user's country of nationality** (e.g., Indian in UAE):
          - ✅ Return:
            - The **user's home country embassy or consulate** in the foreign country
            - Local emergency numbers of the country where the incident happened
            - If available, official Indian portals like **MADAD** for cross-border legal or emergency assistance

        - ⚖️ If it's a **cross-border legal situation** (e.g., Indian arrested abroad or lost passport overseas):
          - ✅ Prioritize verified contacts from **both countries involved** (home + foreign)
          - ✅ Only include embassy contacts if they're **relevant to the case context**

        - 🔍 All contact details must be:
          - Official (from government or legitimate authority)
          - Verifiable (do NOT generate or assume websites, emails, or phone numbers)
          - Mark missing fields as 'null' — **never invent anything**


        **Output only valid JSON. No markdown or extra text.**
        `;

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
