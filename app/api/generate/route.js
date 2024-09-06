import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fetch from 'node-fetch';

const systemPrompt = `For each medical study, present the information in a simplified and non-repetitive format. Detail the study name and description initially in their original form followed by a simplified version. Only include those study that match the user condition, min age, and location preference. Format as follows:
1. Original Title: [Insert original title] 
2. Simplified Title: [Insert simplified title explaining all medical terms, chemical formulas, devices, or hormones present. Don’t change any meanings, just provide simplified explanation for each term]
3. Original Description: [Insert original description]
4. Simplified Description: [Insert simplified description, clarifying all medical terms, chemical formulas, devices, or hormones. Give a very in-depth explanation]
5. Number of Participants: [Insert number]
6. Minimum Age: [Insert age]
7. Lead Sponsor: [Insert sponsor] 
Ensure that there is a line space between each subtitle and maintain a consistent output format for each study without using separators like '---' between sections. Place the title information before the description for both original and simplified versions, and ensure space between the original and simplified titles and descriptions.`;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function fetchClinicalTrials(disease, location, intr) {
    const disease2 = await simplifyDisease(disease);
    console.log("Simplified disease:", disease2);
    const baseURL = 'https://clinicaltrials.gov/api/v2/studies';
    const params = new URLSearchParams({
        'query.cond': disease2,
        pageSize: '15'
    });

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
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text }]
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error simplifying text:', error);
        return { error: "Simplification failed", details: text };
    }
}

async function simplifyDisease(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: 'You have been provided with a patient diagnosis, condition, or disease. Simplify this query into 2-4 words at max to be able to call a search query in the clinical trials gov API. Don’t use adjectives, only medical terms. For example, if the query is "I have really bad stomach pain", return "stomach pain".' }, { role: "user", content: text }]
        });

        const simplifiedDisease = completion.choices[0].message.content.trim();
        console.log("Simplified Disease:", simplifiedDisease); // Add logging here to verify
        return simplifiedDisease;
    } catch (error) {
        console.error('Error simplifying text:', error);
        return { error: "Simplification failed", details: text };
    }
}

export async function POST(req) {
    let count = 1; // Initialize count inside the function
    let seenStudies = new Set(); // Reset seen studies for each request

    try {
        const requestBody = await req.text();
        const parsedBody = JSON.parse(requestBody);
        const disease = parsedBody.text;
        const age = parseInt(parsedBody.age) || 100;
        const location = parsedBody.location;
        const intr = parsedBody.intervention;

        const trialsData = await fetchClinicalTrials(disease, location, intr);
        if (!trialsData.studies || trialsData.studies.length === 0) {
            console.log('No studies found for the given disease:', disease);
            throw new Error('No studies found for the given disease.');
        }

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
            const minimumAgeValue = parseInt(minimumAge.match(/(\d+)/));

            if (age >= minimumAgeValue && count <= 12) {
                const studyDetails = JSON.stringify({
                    studyName: trialName,
                    studyDescription: protocolSection.descriptionModule.briefSummary,
                    number: protocolSection.designModule?.enrollmentInfo?.count || "Not specified",
                    minimumAge: minimumAge,
                    leadSponsor: protocolSection.sponsorCollaboratorsModule?.leadSponsor?.name || "Not specified"
                });

                count += 1;
                const simplifiedText = await simplifyText(studyDetails);
                allSimplifiedTexts.push(simplifiedText);
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
