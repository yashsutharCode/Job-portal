import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the AI with your key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getMatchScore = async (req, res) => {
    try {
        const { resumeSkills, jobDescription } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            You are an expert HR recruiter. 
            Compare the following User Skills with the Job Requirements.
            User Skills: ${resumeSkills}
            Job Requirements: ${jobDescription}

            Return ONLY a JSON object with these exact keys:
            {
              "score": (a number 0-100),
              "feedback": (a 15-word summary of the match),
              "missingSkills": (an array of the top 3 missing skills)
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Remove potential markdown backticks from AI response
        const cleanJson = text.replace(/```json|```/g, "").trim();
        
        return res.status(200).json({
            data: JSON.parse(cleanJson),
            success: true
        });
    } catch (error) {
        console.error("AI matching error:", error);
        return res.status(500).json({ message: "AI Analysis failed", success: false });
    }
};