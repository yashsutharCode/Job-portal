export const getMatchScore = async (req, res) => {
    try {
        console.log("=== AI DEBUG START ===");

        const { resumeSkills, jobDescription } = req.body;

        console.log("API KEY:", process.env.GEMINI_API_KEY);

        if (!resumeSkills || !jobDescription) {
            return res.status(400).json({
                message: "Missing skills or job description",
                success: false
            });
        }

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

        // ✅ NEW WORKING API CALL (NO SDK ISSUE) 
            const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                }),
            }
        );

        const data = await response.json();

        console.log("AI RAW:", data);

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        console.log("AI TEXT:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
    console.log("FULL AI RESPONSE:", data);
    return res.status(500).json({
        message: "AI returned invalid format",
        success: false
    });
}

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