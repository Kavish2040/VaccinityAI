import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
    try {
        const { criteria } = await req.json();
        console.log("inside here: " + criteria);

        if (!criteria) {
            return NextResponse.json({ questions: ["No given criteria for this study"] });
        }

        const prompt = `
        For the given eligibility criteria, create a set of yes/no questions that can be presented to the user as part of a yes or no eligibility screening process. Each question should:
            This is a pre trial set of questions to check if a patient is eligibile for a trial on a basic level. This is to match patients to clinical trials. ONLY ASK SUCH QUESTIONS THAT A USER WITHOUT A LOT OF KNOWLEDGE ABOUT HIS CONDITION CAN HAVE. this is just ot check basic match between them
            Directly correspond to a specific criterion from the provided list.
            Be phrased in a clear, concise manner that can be answered with a simple 'yes' or 'no'.
            Be suitable for a checkbox format, where checking the box indicates 'yes' and leaving it unchecked indicates 'no'.
            Avoid open-ended questions or those requiring numerical or text input.
            Cover all relevant aspects of the eligibility criteria without redundancy.
            Be worded in a way that is easily understandable to the average user, avoiding complex jargon where possible.
            Only ask questions based on eligibility criteria that a person can easily know without consulting a medical professional. Do not ask vague or overly specific medical questions that require clinical knowledge or recent medical assessments. For example, avoid questions like "Have you not experienced clinically significant hemoptysis (coughing up blood) greater than 50ml per day within the last 3 months?" as most people would not be aware of such detailed medical information without a doctor's input. Only include questions that someone with a basic understanding of their condition can answer confidently. Do not use introductory phrases like "Here are the yes/no questions based on the eligibility criteria that a patient can answer without consulting a medical professional:"
           DONT ASK ' Have you signed an informed consent form for the trial?' qeustions like these these questions are BEFORE THE PATIENT HAS BEEN MATCHED OR GONE THROUGH THE CLINCAL TRIAL.
        Please format your response as a numbered list of questions, each beginning with 'Do you' or 'Are you' to ensure they can be answered via checkbox selection.

        Eligibility Criteria:
        ${criteria}
        
        Don't write anything like "Here is a set of yes/no questions that can be presented to the user as part of a checkbox-based eligibility screening process, based on the provided eligibility criteria:"—just give questions.
     
     
        `;

        // Initialize OpenAI client
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: 'API key missing.' }, { status: 500 });
        }

        // Create a chat completion
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1024,
            temperature: 0.7,
        });

        const generatedText = response.choices[0].message.content;
        const questions = generatedText
            .split('\n')
            .filter(q => q.trim())
            .map(question => ({
                text: question.trim(),
                selected: false,
            }));

        return NextResponse.json({ questions });
    } catch (error) {
        console.error('Error generating questions:', error);

        if (error instanceof OpenAI.APIError) {
            console.error('Status:', error.status);       // e.g., 401
            console.error('Message:', error.message);     // e.g., 'The authentication token you passed was invalid...'
            console.error('Code:', error.code);           // e.g., 'invalid_api_key'
            console.error('Type:', error.type);           // e.g., 'invalid_request_error'
        }

        return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 });
    }
}
