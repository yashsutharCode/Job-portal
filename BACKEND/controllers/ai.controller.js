import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getMatchScore = async (req, res) => {
    try {
        const { resumeSkills, jobDescription } = req.body;
        
        // Use gemini-1.5-flash for faster, cheaper production responses
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert HR recruiter. 
            Compare the User Skills with the Job Requirements.
            User Skills: ${resumeSkills}
            Job Requirements: ${jobDescription}

            Return ONLY a raw JSON object (no markdown, no backticks) with:
            {
              "score": (number 0-100),
              "feedback": (15-word summary),
              "missingSkills": (array of top 3 missing skills)
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Robust JSON Cleaning
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const parsedData = JSON.parse(cleanJson);
        
        return res.status(200).json({
            data: parsedData,
            success: true
        });
    } catch (error) {
        console.error("AI matching error:", error);
        return res.status(500).json({ 
            message: "AI Analysis failed", 
            error: error.message,
            success: false 
        });
    }
};