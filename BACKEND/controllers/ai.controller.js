import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// BACKEND/controllers/ai.controller.js

export const getMatchScore = async (req, res) => {
    try {
        const { resumeSkills, jobDescription } = req.body;

        if (!resumeSkills || !jobDescription) {
            return res.status(400).json({ 
                message: "Missing skills or job description", 
                success: false 
            });
        }

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
        const text = result.response.text();

        // IMPROVED CLEANING: Find the first '{' and last '}' to isolate JSON
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        const jsonString = text.substring(start, end);
        
        const parsedData = JSON.parse(jsonString);
        
        return res.status(200).json({
            data: parsedData,
            success: true
        });
    } catch (error) {
        console.error("AI Matching Error:", error);
        return res.status(500).json({ 
            message: "AI Analysis failed. Ensure GEMINI_API_KEY is set in Render Environment.", 
            success: false 
        });
    }
};