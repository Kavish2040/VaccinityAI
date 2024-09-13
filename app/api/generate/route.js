import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fetch from 'node-fetch';

const systemPrompt = `For each medical study, present the information in a simplified and non-repetitive format. Detail the study name and description initially in their original form followed by a simplified version. Only include those study that match the user condition, min age, and location preference. Format as follows:
1. ID -> Mention the unique Protocol Identification Number. Trim any extra spaces before and after the words
2. Original Title -> [Insert original title] 
3. Simplified Title -> [Insert simplified title explaining all medical terms, chemical formulas, devices, or hormones present. Don't change any meanings, just provide simplified explanation for each term]
4. Original Description -> [Insert original description]
5. Simplified Description -> [Insert simplified description, clarifying all medical terms, chemical formulas, devices, or hormones. Give a very in-depth explanation]
6. Number of Participants -> [Insert number]
7. Minimum Age -> [Insert age]
8. Lead Sponsor -> [Insert sponsor] 
9. Eligibility Criteria -> Give both eligibility and ineligibility requirements. Dont seperate them by a newline. Just write Inclusion: whatever whatever the text is to start with 
10. Location -> Mention location of sponsore, facility, including coountry, zip code, city, and geopoint. if recieving multiple locations in text group all of them together without new line and return
Ensure that there is a line space between each subtitle even after the last 9. line and maintain a consistent output format for each study without using separators like '---' between sections. Place the title information before the description for both original and simplified versions, and ensure space between the original and simplified titles and descriptions.`;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function fetchClinicalTrials(disease, location, intr, pageToken = '') {
    const disease2 = await simplifyDisease(disease);
    const baseURL = 'https://clinicaltrials.gov/api/v2/studies';
    const params = new URLSearchParams({
        'query.cond': disease2,
        pageSize: '50',  // Fetch more studies than needed
        format: 'json'
    });

    if (location) {
        params.append('query.locn', location);
    }
    if (intr) {
        params.append('query.intr', intr);
    }
    if (pageToken) {
        params.append('pageToken', pageToken);
    }

    const url = `${baseURL}?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
            const data = await response.json();
            return {
                studies: data.studies.slice(0, 6),  // Return only 6 studies
                nextPageToken: data.nextPageToken,
                hasMore: data.studies.length > 6  // Check if there are more studies
            };
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
            messages: [{ role: "system", content: `You have been provided with a patient diagnosis, condition, or disease. Simplify this query into 2-4 words at max to be able to call a search query in the clinical trials gov API. Don't use adjectives, only medical terms. For example, if the query is "I have really bad stomach pain", return "stomach pain".` }, { role: "user", content: text }]
        });

        const simplifiedDisease = completion.choices[0].message.content.trim();
        console.log("Simplified Disease:", simplifiedDisease);
        return simplifiedDisease;
    } catch (error) {
        console.error('Error simplifying text:', error);
        return { error: "Simplification failed", details: text };
    }
}

export async function POST(req) {
    try {
        const requestBody = await req.text();
        const parsedBody = JSON.parse(requestBody);
        const { text, age, location, intervention, pageToken } = parsedBody;

        const trialsData = await fetchClinicalTrials(text, location, intervention, pageToken);
        if (trialsData.error) {
            throw new Error(trialsData.error);
        }

        let allSimplifiedTexts = [];
        for (const trial of trialsData.studies) {
            const protocolSection = trial.protocolSection;
            if (!protocolSection || !protocolSection.identificationModule || !protocolSection.descriptionModule) {
                continue;
            }

            const studyDetails = JSON.stringify({
                ID: protocolSection.identificationModule.orgStudyIdInfo.id,
                studyName: protocolSection.identificationModule.officialTitle || protocolSection.identificationModule.briefTitle,
                studyDescription: protocolSection.descriptionModule.briefSummary,
                number: protocolSection.designModule?.enrollmentInfo?.count || "Not specified",
                minimumAge: protocolSection.eligibilityModule?.minimumAge || "Not specified",
                leadSponsor: protocolSection.sponsorCollaboratorsModule?.leadSponsor?.name || "Not specified",
                eligibilityCriteria: protocolSection.eligibilityModule?.eligibilityCriteria || "Not specified",
                locations: protocolSection.contactsLocationsModule?.locations || "Not specified"
            });

            const simplifiedText = await simplifyText(studyDetails);
            allSimplifiedTexts.push(simplifiedText);
        }

        return new NextResponse(JSON.stringify({
            studies: allSimplifiedTexts,
            nextPageToken: trialsData.nextPageToken,
            hasMore: trialsData.hasMore
        }), {
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