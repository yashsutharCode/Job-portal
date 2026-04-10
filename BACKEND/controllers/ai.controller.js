import { GoogleGenerativeAI } from "@google/generative-ai";

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

        // ✅ FIXED MODEL
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Compare the following User Skills with the Job Requirements.

User Skills: ${resumeSkills}
Job Requirements: ${jobDescription}

Return ONLY valid JSON:
{
  "score": number (0-100),
  "feedback": string,
  "missingSkills": string[]
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // safer JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsedData = JSON.parse(jsonMatch[0]);

        return res.status(200).json({
            data: parsedData,
            success: true
        });

    } catch (error) {
        console.error("AI Matching Error:", error);
        return res.status(500).json({
            message: "AI Analysis failed.",
            error: error.message,
            success: false
        });
    }
};