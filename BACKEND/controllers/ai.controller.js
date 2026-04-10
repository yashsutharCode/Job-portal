import OpenAI from "openai";

export const getMatchScore = async (req, res) => {
    try {
        const { resumeSkills, jobDescription } = req.body;

        // 1. Validation for input data
        if (!resumeSkills || !jobDescription) {
            return res.status(400).json({
                message: "Missing skills or job description",
                success: false
            });
        }

        // 2. Check if the Groq API Key is present
        if (!process.env.GROQ_API_KEY) {
            console.error("AI CONFIG ERROR: GROQ_API_KEY is missing from environment.");
            return res.status(500).json({
                message: "Server Configuration Error: API Key not found.",
                success: false
            });
        }

        // 3. Initialize Groq using the OpenAI library
        const groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1", // Points to Groq's free tier
        });

        // 4. Request the analysis from Llama 3
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an expert HR recruiter. Compare user skills with job requirements and return ONLY a valid JSON object."
                },
                {
                    role: "user",
                    content: `User Skills: ${resumeSkills}\nJob Requirements: ${jobDescription}\n\nReturn JSON format: {"score": number, "feedback": string, "missingSkills": array}`
                }
            ],
            response_format: { type: "json_object" } // This prevents "invalid format" errors
        });

        // 5. Parse and return the data
        const parsedData = JSON.parse(response.choices[0].message.content);

        return res.status(200).json({
            data: parsedData,
            success: true
        });

    } catch (error) {
        console.error("AI Analysis Error:", error.message);
        return res.status(500).json({
            message: "AI Analysis failed to process.",
            error: error.message,
            success: false
        });
    }
};