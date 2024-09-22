import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `Give short and concise answers to user questions`;

export async function POST(req) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  
  try {
    const data = await req.json();  // Retrieve the request body

    // Make the OpenAI API call for chat completion
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...data, // Spread the messages from the request body
      ],
      model: "gpt-3.5-turbo",
    });

    // Retrieve the assistant's response
    const assistantMessage = completion.choices[0].message.content;

    // Send the assistant's message as a JSON response
    return NextResponse.json({ content: assistantMessage });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
