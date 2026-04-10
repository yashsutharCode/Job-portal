import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API Key is correctly loaded from the environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getMatchScore = async (req, res) => {
    try {
        const { resumeSkills, jobDescription } = req.body;

        if (!resumeSkills || !jobDescription) {
            return res.status(400).json({ 
                message: "Missing skills or job description", 
                success: false 
            });
        }

        // FIX: Use the fully qualified model name
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert HR recruiter. 
            Compare the User Skills with the Job Requirements.
            User Skills: ${resumeSkills}
            Job Requirements: ${jobDescription}

            Return ONLY a valid JSON object. 
            {
              "score": (number),
              "feedback": (string),
              "missingSkills": (array)
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Improved JSON cleaning to handle potential markdown formatting from AI
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        
        if (start === -1 || end === 0) {
            throw new Error("Invalid AI response format");
        }

        const jsonString = text.substring(start, end);
        const parsedData = JSON.parse(jsonString);
        
        return res.status(200).json({
            data: parsedData,
            success: true
        });
    } catch (error) {
        console.error("AI Matching Error:", error);
        return res.status(500).json({ 
            message: "AI Analysis failed. Please check server logs.", 
            error: error.message,
            success: false 
        });
    }
};