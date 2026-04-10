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

        // FIX: Ensure you are using the correct model string
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

        const prompt = `
            Compare the following User Skills with the Job Requirements.
            User Skills: ${resumeSkills}
            Job Requirements: ${jobDescription}

            Return ONLY a valid JSON object:
            {
              "score": (number 0-100),
              "feedback": (string),
              "missingSkills": (array)
            }
        `;

        const result = await model.generateContent(prompt);
        // FIX: Wait for the full response before calling .text()
        const response = await result.response;
        const text = response.text();

        // Extract JSON to handle potential markdown formatting
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        const parsedData = JSON.parse(text.substring(start, end));
        
        return res.status(200).json({ data: parsedData, success: true });
    } catch (error) {
        console.error("AI Matching Error:", error.message);
        return res.status(500).json({ 
            message: "AI Analysis failed.", 
            error: error.message, 
            success: false 
        });
    }
};