import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
    try {
        const { criteria } = await req.json();
        console.log("inside here"+criteria)
        if (!criteria) {
            return NextResponse.json({ questions: ["No given criteria for this study"] });
        }

        const prompt = `
        "For the given eligibility criteria, create a set of yes/no questions that can be presented to the user as part of a yes or no eligibility screening process. Each question should:

            Directly correspond to a specific criterion from the provided list.
            Be phrased in a clear, concise manner that can be answered with a simple 'yes' or 'no'.
            Be suitable for a checkbox format, where checking the box indicates 'yes' and leaving it unchecked indicates 'no'.
            Avoid open-ended questions or those requiring numerical or text input.
            Cover all relevant aspects of the eligibility criteria without redundancy.
            Be worded in a way that is easily understandable to the average user, avoiding complex jargon where possible.

            Please format your response as a numbered list of questions, each beginning with 'Do you' or 'Are you' to ensure they can be answered via checkbox selection.
            Eligibility Criteria:
            ${criteria}
            Have questions covering every eligibility and exclusion criteria text. COVER EVERY SINGLE POSSIBLE QUESTION THAT CAN BE MADE
            Dont write anything like Here is a set of yes/no questions that can be presented to the user as part of a checkbox-based eligibility screening process, based on the provided eligibility criteria: just give questions.
            Make sure to be precise and mention every small detail and explain complicated medical terms present in the qeustion in () next to the word itsefl
         Make question withing this models token limit
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
                temperature: 0.7,
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
        const questions = generatedText.split('\n').filter(q => q.trim()).map(question => ({
            text: question.trim(),
            selected: false,
        }));

        return NextResponse.json({ questions });
    } catch (error) {
        console.error('Error generating questions:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 });
    }
}