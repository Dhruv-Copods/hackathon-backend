import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getPromptContent = (userInput) => {
    const systemMessage = `
        You are an expert assistant for processing unstructured timesheet data spanning multiple days. Your role is to:
        - Parse user input containing details about dates, tasks, and hours worked across several days.
        - Extract and structure the data for each day into a JSON array, where each object represents a single day.
        - Summarize the tasks with clear descriptions and calculate total hours worked per day.
        - If the total hours for a day exceed 8, proportionally adjust the hours for each task to ensure the total equals 8.
        - If a date is missing or ambiguous, infer it based on context (e.g., assume sequential days if unspecified).
    `;

    const userMessageExample = `
        The user will provide unstructured input describing their work across multiple days. Here’s an example:

        Example Input:
        "On December 19, I worked on frontend fixes for 6 hours, attended a meeting for 4 hours, and reviewed code for 2 hours. 
        On December 20, I completed backend API development for 9 hours and participated in a brainstorming session for 3 hours."

        Expected Output:
        [
            {
                "date": "2024-12-19",
                "tasks": [
                    { "description": "Frontend fixes", "hours": 4.8 },
                    { "description": "Meeting", "hours": 3.2 },
                    { "description": "Code review", "hours": 0 }
                ],
                "totalHours": 8
            },
            {
                "date": "2024-12-20",
                "tasks": [
                    { "description": "Backend API development", "hours": 6 },
                    { "description": "Brainstorming session", "hours": 2 }
                ],
                "totalHours": 8
            }
        ]

        Key instructions:
        - Extract the date for each day in YYYY-MM-DD format.
        - Identify and summarize each task clearly.
        - Ensure the hours per task are accurately extracted.
        - Proportionally adjust the hours of tasks if the total exceeds 8 for a single day.
        - Return the data as a JSON array, with one object per day.
        - If a date is missing or ambiguous, infer it based on context.

        Now process the following input:

        "${userInput}"
    `;

    return { systemMessage, userMessageExample };
};

export const multiDayData = async (userInput) => {
    try {
        const { systemMessage, userMessageExample } = getPromptContent(userInput);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessageExample },
            ],
        });

        // Extract the content from the response
        let responseContent = completion.choices[0].message.content;

        // Clean up the response to remove formatting markers and assumptions
        if (responseContent.includes("```json")) {
            responseContent = responseContent.split("```json")[1].split("```")[0].trim();
        }

        // Parse the cleaned JSON content
        const parsedData = JSON.parse(responseContent);

        return parsedData;
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        throw new Error("Failed to generate or parse response from OpenAI");
    }
};


