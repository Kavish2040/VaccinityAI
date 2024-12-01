import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `Give short and concise answers to user questions`;

export async function POST(req) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  
  try {
    const data = await req.json();  

   
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...data, 
      ],
      model: "gpt-3.5-turbo",
    });

    const assistantMessage = completion.choices[0].message.content;

  
    return NextResponse.json({ content: assistantMessage });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
