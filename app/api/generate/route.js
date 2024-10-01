// app/api/generate/route.js

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Function to simplify the disease input
async function simplifyDisease(text) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Simplify the following patient diagnosis, condition, or disease into 2-4 words to use as a search query in the ClinicalTrials.gov API. Use medical terms without adjectives. For example, "I have really bad stomach pain" becomes "stomach pain".`
                },
                { role: "user", content: text }
            ]
        });

        const simplifiedDisease = completion.choices[0].message.content.trim();
        console.log("Simplified Disease:", simplifiedDisease);
        return simplifiedDisease;
    } catch (error) {
        console.error('Error simplifying disease:', error);
        return text; // Return original text if simplification fails
    }
}

// Function to simplify the study title
async function simplifyTitle(title) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Simplify the following study title, explaining medical terms, chemical formulas, devices, or hormones present. Don't change any meanings, just provide a simplified title. Give a super detailed and VERY SIMPLE title that a PERSON WITH VERY LITTLE MEDICAL KNOWLEDGE CAN UNDERSTAND. GIVE A GOOD LENGTH TITLE SIMPLYFYING EVERY ACRONYM OR MEDICAL WORD IF PRESENT"
                },
                { role: "user", content: title }
            ]
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error simplifying title:', error);
        return title; // Return original title if simplification fails
    }
}

// Function to fetch clinical trials from ClinicalTrials.gov API
async function fetchClinicalTrials(disease, location, intervention, pageSize = 25, pageToken = null) {
    const baseURL = 'https://clinicaltrials.gov/api/v2/studies';
    const params = new URLSearchParams({
        'query.cond': disease,
        'pageSize': pageSize.toString(),
    });

    if (location) {
        params.append('query.locn', location);
    }
    if (intervention) {
        params.append('query.intr', intervention);
    }
    if (pageToken) {
        params.append('pageToken', pageToken);
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

// POST handler for the generate API
export async function POST(req) {
    try {
        const requestBody = await req.json();
        const diseaseInput = requestBody.text;
        const disease = await simplifyDisease(diseaseInput);
        const age = parseInt(requestBody.age) || 100;
        const location = requestBody.location;
        const intervention = requestBody.intervention;
        const pageSize = parseInt(requestBody.pageSize) || 25;
        const pageToken = requestBody.pageToken || null;
        const seenIds = new Set(requestBody.seenIds || []);

        const trialsData = await fetchClinicalTrials(disease, location, intervention, pageSize, pageToken);

        if (!trialsData.studies || trialsData.studies.length === 0) {
            console.log('No studies found for the given disease:', disease);
            return NextResponse.json({
                studies: [],
                nextPageToken: null,
                hasMore: false
            }, { status: 200 });
        }

        let simplifiedStudies = [];

        for (const trial of trialsData.studies) {
            const protocolSection = trial.protocolSection;
            if (!protocolSection || !protocolSection.identificationModule) {
                continue;
            }

            const trialId = protocolSection.identificationModule.nctId;
            if (!seenIds.has(trialId)) {
                

                const minimumAgeValue = protocolSection.eligibilityModule?.minimumAge || "0 years";
                const minimumAge = parseInt(minimumAgeValue.match(/(\d+)/));

                const participants = protocolSection.designModule?.enrollmentInfo?.count || "Not specified";

                const studyDetails = {
                    ID: trialId,
                    studyName: protocolSection.identificationModule.officialTitle || protocolSection.identificationModule.briefTitle,
                    minimumAge: minimumAge,
                    participants: participants,
                };

                const simplifiedTitle = await simplifyTitle(studyDetails.studyName);

                simplifiedStudies.push({
                    ID: studyDetails.ID,
                    originalTitle: studyDetails.studyName,
                    simplifiedTitle: simplifiedTitle,
                    minimumAge: studyDetails.minimumAge,
                    participants: studyDetails.participants,
                });

                seenIds.add(trialId);
            }
        }

        return NextResponse.json({
            studies: simplifiedStudies,
            nextPageToken: trialsData.nextPageToken || null,
            hasMore: Boolean(trialsData.nextPageToken)
        }, { status: 200 });

    } catch (error) {
        console.error('Error in POST:', error);
        return NextResponse.json({ error: 'Failed to process request', detail: error.message }, { status: 500 });
    }
}
