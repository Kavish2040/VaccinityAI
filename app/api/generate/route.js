import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fetch from 'node-fetch';

const systemPrompt = `For each medical study, present the information in a simplified and non-repetitive format. Detail the study name and description initially in their original form followed by a simplified version. Only include those study that match the user condition ,min age, and location preference . Format as follows:
1. Original Title: [Insert original title] (edit it accordingly to keep first letter of the first)
2. Simplified Title: [Insert simplified title explaining all medical terms, chemical formulas, devices, or hormones present. Dont change any meanings, just provide simplified explanation fo each term]
3. Original Description: [Insert original description]
4. Simplified Description: [Insert simplified description, clarifying all medical terms, chemical formulas, devices, or hormones]
After the simplified description, provide additional details on separate lines:
- Number of Participants: [Insert number]
- Minimum Age for Participation: [Insert age]
- Lead Sponsor: [Insert sponsor] 
Ensure that there is a line space between each subtitle and maintain a consistent output format for each study without using separators like '---' between sections. Place the title information before the description for both original and simplified versions, and ensure space between the original and simplified titles and descriptions.`;


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function fetchClinicalTrials(disease, location, intr) {
    const disease2 = await simplifyDisease(disease);
    console.log(disease2)
    const baseURL = 'https://clinicaltrials.gov/api/v2/studies';
    const params = new URLSearchParams({
        'query.cond': disease2, // Always include the condition
        pageSize: '12'
    });

    // Only add location and intervention if they are provided
   if (location) {
        params.append('query.locn', location);
   }
    if (intr) {
        params.append('query.intr', intr);
   }

    const url = `${baseURL}?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
            const data = await response.json();
            //console.log(data)
            return data;
        } else {
            console.error("Failed to fetch or non-JSON response received:", await response.text());
            return { error: "Failed to fetch data or received non-JSON response" };
        }
    } catch (error) {
        console.error('Error fetching clinical trials:', error);
        return { error: "An error occurred while fetching data" };
    }
}




async function simplifyText(text) {
    try {
        //console.log(location+age)
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text}]
        });
        // Assuming the response is plain text and not JSON formatted:
        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error simplifying text:', error);
        return { error: "Simplification failed", details: text };  // Return original text if simplification fails
    }
}

async function simplifyDisease(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: 'You have been provided with patient diagnosis or condition or diseases simplify this uqery into 2-4 words at max to be able to call a search query with it in the clinical trials gov api. Dont have adjectives only medical words needed. For example, if query is "i have really bad stomach pain " return "stomach pain". Match all study detail according to age location and disease condition '}, { role: "user", content: text }]
        });
        // Assuming the response is plain text and not JSON formatted:
        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error simplifying text:', error);
        return { error: "Simplification failed", details: text };  // Return original text if simplification fails
    }
}

export async function POST(req) {
    try {
        const requestBody = await req.text();
        const parsedBody = JSON.parse(requestBody);
        const disease = parsedBody.text;
        const age = parseInt(parsedBody.age); // Ensure age is an integer
        const location = parsedBody.location;
        const intr = parsedBody.intervention;

        const trialsData = await fetchClinicalTrials(disease, location, intr);
        if (!trialsData.studies || trialsData.studies.length === 0) {
            throw new Error('No studies found for the given disease.');
        }

        let seenStudies = new Set();
        let allSimplifiedTexts = [];

        for (const trial of trialsData.studies) {
            const protocolSection = trial.protocolSection;
            if (!protocolSection || !protocolSection.identificationModule || !protocolSection.descriptionModule) {
                continue;
            }

            const trialName = protocolSection.identificationModule.officialTitle || protocolSection.identificationModule.briefTitle;
            if (seenStudies.has(trialName)) continue;
            seenStudies.add(trialName);

            const minimumAge = protocolSection.eligibilityModule?.minimumAge || "0 years";
            //console.log(minimumAge)
            const minimumAgeValue = parseInt(minimumAge.match(/(\d+)/));

            console.log(minimumAgeValue)
            // Check if the user's age meets the minimum age requirement of the study
            if(age>=minimumAgeValue){
                const studyDetails = JSON.stringify({
                    studyName: trialName,
                    studyDescription: protocolSection.descriptionModule.briefSummary,
                    number: protocolSection.designModule?.enrollmentInfo?.count || "Not specified",
                    minimumAge: minimumAge,
                    leadSponsor: protocolSection.sponsorCollaboratorsModule?.leadSponsor?.name || "Not specified"
                });
                
                //console.log(studyDetails)
                const simplifiedText = await simplifyText(studyDetails);
                //console.log(simplifiedText)
                allSimplifiedTexts.push(simplifiedText);
                //console.log(allSimplifiedTexts)
            }
            
        }

        return new NextResponse(JSON.stringify({ studies: allSimplifiedTexts }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('Error in POST:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to process request', detail: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}
