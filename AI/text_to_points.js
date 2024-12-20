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
        You are an expert assistant for processing unstructured timesheet data. Your role is to:
        - Parse user input containing details about dates, tasks, and hours worked.
        - Extract and structure the data into a clean JSON format.
        - Summarize the tasks with clear descriptions and calculate total hours worked for each day.
        - If the total hours for a day exceed 8, proportionally adjust the hours for each task so the total does not exceed 8.
        - If a date is missing, assume today’s date.
        - Handle incomplete or ambiguous data by inferring the most reasonable interpretation and state assumptions in the JSON output.
    `;

    const userMessageExample = `
        The user will provide unstructured input. Here’s an example for reference:

        Example Input:
        "On December 19, I worked on frontend fixes for 6 hours, attended a meeting for 4 hours, and reviewed code for 2 hours."

        Expected Output:
        {
            "date": "2024-12-19",
            "tasks": [
                { "description": "Frontend fixes", "hours": 3.6 },
                { "description": "Meeting", "hours": 2.4 },
                { "description": "Code review", "hours": 2.0 }
            ],
            "totalHours": 8
        }

        Key instructions:
        - Extract the date in YYYY-MM-DD format.
        - Identify and summarize each task clearly.
        - Ensure the hours per task are accurately extracted.
        - Proportionally adjust the hours for tasks if the total hours exceed 8 for a single day.
        - Provide a total of all hours worked per day and return the data as a JSON object.
        - Handle ambiguous or missing information gracefully.
        
        Now process the following input:

        "${userInput}"
    `;

    return { systemMessage, userMessageExample };
};


export const textToPoints = async (userInput) => {
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

        // Return the generated response
        return JSON.parse(responseContent);
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        throw new Error("Failed to generate response from OpenAI");
    }
};
