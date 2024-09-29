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
Generate a set of yes/no questions for a clinical trial eligibility screening process based on the following criteria. Ensure that each question meets the guidelines below:

1. **Simplicity and Accessibility**:
   - **Language**: Use clear, straightforward language suitable for individuals without medical training.
   - **Structure**: Start each question with "Do you" or "Are you" to facilitate easy checkbox selection.
   - **Terminology**: Avoid medical jargon. If a medical term is necessary, provide a simple explanation in parentheses.
     - *Example*: Do you have a history of myocardial infarction (heart attack)?
   - DONT MAKE QUESTIONS ON VAGUE THINGS LIKE "CERTAIN MEDICATIONS OR CERTAIN INFECTIONS" THAT MAY EXCLUDE THE PATIENT FROM THE STUDY ONLY WRITE A QUESTION IF A SPECIFIC MEDICATION OR INFECTION NAME IS GIVEN OTHERWISE AVOID IT. AVOID QUESTIONS LIKE THESE:  Are you using any specific medications that might exclude you from the trial? or  Do you have any infections that might exclude you from the trial? 
    The patient does not have details about medications that may exclude them from the trial so we CANNOT AT ALL cost ask such questions
   - DONT MAKE QUESTION WITH CERTAIN SPECFIC VALUES LIKE LEVEL ABOVE X% OR ABC Value of r.xy ... AVOID SUCH QUESTIONS, ONLY ASK THOSE QUESTION THAT A PERSON WITH BASIC KNOWLEDGE ABOUT HIS CONDITION CAN ANSWER WITHOUT HAVING TO ASK HIS DOCTOR 

2. **Direct Alignment with Eligibility Criteria**:
   - Each question must correspond directly to a specific eligibility criterion provided. do not make questions on VAGUE ELIGIBILITY CRITERIAS

3. **Yes/No Format**:
   - Frame questions to be answerable with a simple 'Yes' or 'No'.
   - Ensure compatibility with a checkbox format where checking indicates 'Yes' and leaving it unchecked indicates 'No'.
   - Avoid questions that require numerical answers or detailed explanations.

4. **Patient-Centric Focus**:
   - **Knowledge Level**: Only include questions that a patient can answer based on their personal knowledge and experiences at home.
   - **Avoid Complexity**: Do not ask questions that require detailed medical information, recent clinical assessments, or professional medical judgment.
     - *Do not include*: "Have you experienced clinically significant hemoptysis (coughing up blood) greater than 50ml per day within the last 3 months?"

5. **Exclude Pre-Match and Irrelevant Questions**:
   - Do not include questions related to trial consent or procedures that occur after eligibility is established.
     - *Do not include*: "Have you signed an informed consent form for the trial?"

6. **No Introductory or Explanatory Text**:
   - Provide only the list of questions without any introductory statements or explanations.
   - *Do not write*: "Here is a set of yes/no questions that can be presented to the user as part of a checkbox-based eligibility screening process, based on the provided eligibility criteria:"

7. **Avoid Vague Questions**:
   - **Specificity is Key**: Only ask questions that mention specific diseases or conditions that could cause exclusion. Avoid general or vague inquiries.
     - *Do not include*: "Do you have any certain infections that would affect your eligibility?"
     - *Include instead*: "Do you have a history of tuberculosis?"
   - **Clear Conditions**: Ensure that each question targets a clearly defined condition or criterion.
   - **No Ambiguity**: Avoid questions that are open to interpretation or require the user to make judgments beyond their personal knowledge.
   - **Examples to Avoid,AVOID ANY QUESTION THAT LOOKS LIKE THIS OR IS IMPLYING THE SAME THING OR IS STRUCTURED SIMILAR TO THIS**:
     - "Do you have any chronic illnesses that might interfere with the trial?"
     - "Are there any health issues we should be aware of?"
     -  "Do you have any current infections?"
     - "Have you tested negative for specific infections?"
     - "Are you using any specific medications that might exclude you from the trial?"
   - **Preferred Examples**:
     - "Do you have diabetes?"
     - "Have you been diagnosed with hypertension?"

**Eligibility Criteria:**
${criteria}

**Output Format:**
- Present the questions as a numbered list.
- If a question includes a medical or complex term, add a brief, simple explanation in parentheses next to the term.
  - *Example*: Are you currently experiencing shortness of breath?

**Example to Avoid:**
- "Have you not experienced clinically significant hemoptysis (coughing up blood) greater than 50ml per day within the last 3 months?"
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
