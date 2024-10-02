// File: /pages/api/match.js or /app/api/match/route.js

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
    try {
        const { questions, answers, eligibilityCriteria } = await req.json();

        // Improved logging for debugging
        console.log("Received Questions:", questions);
        console.log("Received Answers:", answers);
        console.log("Received Eligibility Criteria:", eligibilityCriteria);

        // Validate the incoming data
        if (!questions || !answers || !eligibilityCriteria) {
            return NextResponse.json({ error: "Missing required data" }, { status: 400 });
        }

        // Ensure questions and answers are arrays of strings
        if (!Array.isArray(questions) || !questions.every(q => typeof q === 'string')) {
            return NextResponse.json({ error: "Invalid format for questions. Expected an array of strings." }, { status: 400 });
        }

        if (!Array.isArray(answers) || !answers.every(a => typeof a === 'string')) {
            return NextResponse.json({ error: "Invalid format for answers. Expected an array of strings." }, { status: 400 });
        }

        // Optional: Check if questions and answers lengths match
        if (questions.length !== answers.length) {
            return NextResponse.json({ error: "The number of questions and answers must match." }, { status: 400 });
        }

        // Construct the prompt for the API
        const prompt = `
You are tasked with evaluating whether a potential participant matches the eligibility criteria for a clinical trial based on their responses to a set of questions. Follow the instructions below meticulously to ensure an accurate assessment.

**Eligibility Criteria:**
${typeof eligibilityCriteria === 'string' ? eligibilityCriteria : JSON.stringify(eligibilityCriteria, null, 2)}

**Participant's Questions and Answers:**
${questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join('\n\n')}

**Evaluation Guidelines:**

AT THIS STAGE WE ARE ONLY MAKING A BASIC MATCH NOT A PERFECT MATCH, IF THE PATIENT ANSWERS MATCH WITH THE QUESTIONS JUST BASED ON THE ANSWERS TO THE QUESTIONS GIVE A MATCH OR NO MATHC DONT GO INTO SPECIFICS

VERY IMPORTANT: ONLY MATCH OR NOT MATCH BASED ON THE QUESTIONS RECEIVED AND THE ANSWERS TO THEM. 

1. **Assess Against Eligibility Criteria:**
   - **Inclusion Criteria:** Verify that the participant meets all necessary inclusion requirements.
   - **Exclusion Criteria:** Ensure the participant does not have any conditions or factors that would exclude them from the trial.

2. **Determine Match Status:**
   - If the participant satisfies **all** inclusion criteria and does **not** violate any exclusion criteria, they are a **Match**.
   - If the participant fails to meet **any** inclusion criteria or violates **any** exclusion criteria, they are a **No Match**.

3. **Response Format:**
   - **Your response should be formatted exactly as follows:**

     [Match Status]
     [Explanation]

     - **Match Status:** Write either **"Match"** or **"No Match"** (without quotes).
     - **Explanation:** Provide a concise explanation (1-2 sentences) specifically detailing **why** the participant is a match or not, directly referencing the eligibility criteria.

4. **Additional Instructions:**
   - Do **not** include both "Match" and "No Match" in your response—choose one based on the assessment.
   - Be serious and thorough in evaluating all participant responses; do not disregard any questions unless they are extremely vague.
   - Do **not** include any additional information outside of the specified format.

5. IGNORE ANSWERS TO QUESTIONS LIKE: Are you using any specific medications that might exclude you from the trial? Say match inspite of the answer to this.
`;

        // Initialize OpenAI client
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        if (!process.env.OPENAI_API_KEY) {
            console.error('API key is missing.');
            return NextResponse.json({ error: 'API key missing.' }, { status: 500 });
        }

        // Create a chat completion
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
        });

        // Extract the generated text
        const generatedText = response.choices[0].message.content;
        const lines = generatedText.trim().split('\n');

        let matchStatus = lines[0].trim();
        let explanation = lines.slice(1).join(' ').trim() || 'No explanation provided';

        // Ensure the response format
        if (!['Match', 'No Match'].includes(matchStatus)) {
            console.warn('Unexpected match status:', matchStatus);
            return NextResponse.json({ error: 'Unexpected response format from AI.' }, { status: 500 });
        }

        return NextResponse.json({
            match: matchStatus === 'Match',
            explanation
        });

    } catch (error) {
        console.error('Error processing match request:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to process the match request.' }, { status: 500 });
    }
}
