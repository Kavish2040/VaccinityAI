// app/api/study/[nctId]/route.js

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Function to fetch study details from ClinicalTrials.gov API
async function fetchStudyDetails(nctId) {
    const baseURL = `https://clinicaltrials.gov/api/v2/studies/${nctId}`;
    const url = `${baseURL}?format=json`;

    try {
        const response = await fetch(url);
        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
            const trial = await response.json();

            if (!trial || !trial.protocolSection || !trial.protocolSection.identificationModule) {
                return null;
            }

            const protocolSection = trial.protocolSection;
            const statusModule = protocolSection.statusModule; // Extract the statusModule
            const overallStatus = statusModule?.overallStatus || "Not specified"; // Extract overallStatus

            const trialId = protocolSection.identificationModule.nctId;
            const minimumAge = protocolSection.eligibilityModule?.minimumAge || "Not specified";
            const locations = protocolSection.contactsLocationsModule?.locations || "Not specified";

            const studyDetails = {
                ID: trialId,
                studyName: protocolSection.identificationModule.officialTitle || protocolSection.identificationModule.briefTitle,
                studyDescription: protocolSection.descriptionModule?.briefSummary || "",
                participants: protocolSection.designModule?.enrollmentInfo?.count || "Not specified",
                minimumAge: minimumAge,
                leadSponsor: protocolSection.sponsorCollaboratorsModule?.leadSponsor?.name || "Not specified",
                eligibilityCriteria: protocolSection.eligibilityModule?.eligibilityCriteria || "Not specified",
                locations: locations,
                overallStatus: overallStatus, // Include overallStatus in studyDetails
            };

            return studyDetails;
        } else {
            console.error("Failed to fetch study details or non-JSON response received:", await response.text());
            return null;
        }
    } catch (error) {
        console.error('Error fetching study details:', error);
        return null;
    }
}

// Function to simplify the study description
async function simplifyDescription(description) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Simplify the following study description, clarifying all medical terms, chemical formulas, devices, or hormones. Provide a clear and detailed explanation. Give a proper very simple to understadn FOR A PERSON WITH VERY LITTLE MEDICAL KNOWLEDGE to understand description. Give explanation keeping professional that even a 10th grade student cna understand. Dont write anything like this **Study Description Simplified:** or **Explanation:** "
                },
                { role: "user", content: description }
            ]
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error simplifying description:', error);
        return description; // Return original description if simplification fails
    }
}

// Function to simplify the study title
async function simplifyTitle(title) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Simplify the following study title, explaining medical terms, chemical formulas, devices, or hormones present. Don't change any meanings, just provide a simplified title.explaining medical terms in () next to the word, chemical formulas, devices, or hormones present."
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

// GET handler for the study details API
export async function GET(req, { params }) {
    try {
        const nctId = params.nctId;

        const studyData = await fetchStudyDetails(nctId);

        if (!studyData) {
            return NextResponse.json({ error: 'Study not found' }, { status: 404 });
        }

        const simplifiedTitle = await simplifyTitle(studyData.studyName);
        const simplifiedDescription = await simplifyDescription(studyData.studyDescription);

        const responseData = {
            ID: studyData.ID,
            originalTitle: studyData.studyName,
            simplifiedTitle: simplifiedTitle,
            originalDescription: studyData.studyDescription,
            simplifiedDescription: simplifiedDescription,
            participants: studyData.participants,
            minimumAge: studyData.minimumAge,
            leadSponsor: studyData.leadSponsor,
            eligibilityCriteria: studyData.eligibilityCriteria,
            locations: studyData.locations,
            overallStatus: studyData.overallStatus, // Include overallStatus in the response
            detailedData: true,
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('Error in GET:', error);
        return NextResponse.json({ error: 'Failed to process request', detail: error.message }, { status: 500 });
    }
}
