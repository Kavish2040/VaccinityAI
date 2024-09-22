import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
    try {
        const { questions, answers, eligibilityCriteria } = await req.json();
        console.log("yele" +  questions, answers, eligibilityCriteria  )
        if (!questions || !answers || !eligibilityCriteria) {
            return NextResponse.json({ error: "Missing required data" }, { status: 400 });
        }

        const prompt = `Given the following eligibility criteria for a clinical trial:
${JSON.stringify(eligibilityCriteria, null, 2)}

And the following questions and answers from a potential participant:
${questions.map((q, i) => `Q: ${q.text}\nA: ${answers[i]}`).join('\n\n')}

Determine if the participant matches the eligibility criteria. Consider the following:
1. The answers provided may be detailed text responses, not just yes/no.
2. Evaluate each answer carefully against the corresponding eligibility criterion.
3. Consider both inclusion and exclusion criteria in your evaluation.

Respond in the following format:
- If the participant matches, start with "Match" on its own line, followed by a brief explanation (1-2 sentences) on the next line.
- If the participant does not match, start with "No Match" on its own line, followed by a brief explanation (1-2 sentences) on the next line.

Example responses:
Match
Patient meets all inclusion criteria and does not violate any exclusion criteria. Give full explanation why he/she matches

No Match
Patient does not meet the age requirement and has a contraindicated medical condition.  Give full explanation why he/she does not matches
`;

        const apiKey = process.env.CLAUDE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key missing.' }, { status: 500 });
        }

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

        const generatedText = response.data.content[0].text;
        const lines = generatedText.trim().split('\n');

        let matchStatus = lines[0].trim();
        let explanation = lines[1] ? lines[1].trim() : 'No explanation provided';

        return NextResponse.json({
            match: matchStatus === 'Match',
            explanation
        });

    } catch (error) {
        console.error('Error processing match request:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to process the match request.' }, { status: 500 });
    }
}
