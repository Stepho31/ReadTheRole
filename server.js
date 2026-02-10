import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

// Fail fast if API key is missing
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing");
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/analyze", async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ error: "Job description is required." });
  }

  const prompt = `
Analyze the following job description and return JSON ONLY.

{
  "role_scope_reality": "",
  "true_core_skills": [],
  "nice_to_haves": [],
  "interview_signal": {
    "focus_areas": [],
    "sample_questions": []
  },
  "resume_positioning": {
    "emphasize": [],
    "angle": ""
  },
  "study_topics": [],
  "clarity_score": 0,
  "clarity_explanation": ""
}

Rules:
- Limit true_core_skills to TOP 5
- study_topics must be practical concepts to review or practice
- clarity_explanation must explain why the score was given
- Output MUST be valid JSON
- Do not include markdown or commentary

Job Description:
"""
${jobDescription}
"""
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a strict JSON generator." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      console.error("❌ OpenAI returned unexpected response:", data);
      return res.status(500).json({ error: "Invalid AI response." });
    }

    const result = JSON.parse(data.choices[0].message.content);
    res.json(result);

  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Failed to analyze job description." });
  }
});

app.listen(3000, () => {
  console.log("ReadTheRole running at http://localhost:3000");
});
