// File: /pages/api/match.js or /app/api/match/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

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

1. **Ignore Vague Questions:**
   - **Definition:** Vague questions are general inquiries that do not reference specific conditions, diseases, or factors relevant to the eligibility criteria.
   - **Examples to Ignore:**
     - "Do you have any chronic illnesses that might interfere with the trial?"
     - "Are there any health issues we should be aware of?"
     - "Do you have any current infections?"
   - **Action:** Completely disregard both the question and the corresponding answer if it matches or is similar to any of the above examples.

2. **Focus on Specific Questions:**
   - **Definition:** Specific questions directly correspond to particular inclusion or exclusion criteria and mention explicit conditions or factors.
   - **Action:** Only consider answers to these specific questions when evaluating eligibility.

3. **Assess Against Eligibility Criteria:**
   - **Inclusion Criteria:** Verify that the participant meets all necessary inclusion requirements.
   - **Exclusion Criteria:** Ensure the participant does not have any conditions or factors that would exclude them from the trial.

4. **Detailed Evaluation:**
   - **Match:** The participant satisfies all inclusion criteria and does not violate any exclusion criteria.
   - **No Match:** The participant fails to meet one or more inclusion criteria or violates one or more exclusion criteria.

5. **Response Format:**
   - **If the Participant Matches:**
    
     Match
     [Provide a concise explanation (1-2 sentences) highlighting how the participant meets all inclusion criteria and does not violate any exclusion criteria.]
    
   - **If the Participant Does Not Match:**
     
     No Match
     [Provide a concise explanation (1-2 sentences) detailing which inclusion criteria are not met or which exclusion criteria are violated.]
    

**Important Instructions:**
- **Exclusivity:** Do not reference, consider, or incorporate any information from vague questions in your evaluation.
- **Clarity:** Ensure that the explanation is clear, direct, and specifically tied to the eligibility criteria.
- **Brevity:** Keep explanations concise, limiting them to 1-2 sentences.

**Example Responses:**

*Match*
`

        const apiKey = process.env.CLAUDE_API_KEY;
        if (!apiKey) {
            console.error('API key is missing.');
            return NextResponse.json({ error: 'API key missing.' }, { status: 500 });
        }

        // Call the Anthropics API
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                temperature: 0,
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the generated text
        const generatedText = response.data.content[0].text;
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
