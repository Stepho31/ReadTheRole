import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import multer from "multer";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing");
  process.exit(1);
}

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.static("public"));

app.post("/analyze", upload.single("resume"), async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ error: "Job description is required." });
  }

  let resumeText = "";

  // -------- PDF EXTRACTION --------
  if (req.file) {
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(req.file.buffer)
      });      

      const pdfDoc = await loadingTask.promise;

      let textContent = "";

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const text = await page.getTextContent();
        const pageText = text.items.map(item => item.str).join(" ");
        textContent += pageText + "\n";
      }

      if (!textContent || textContent.trim().length < 50) {
        return res.status(400).json({
          error: "Resume text could not be extracted."
        });
      }

      resumeText = textContent;

    } catch (err) {
      console.error("PDF extraction error:", err);
      return res.status(400).json({
        error: "Failed to extract resume text."
      });
    }
  }

  // -------- AI PROMPT --------
  const prompt = `
Analyze the job description and optional resume.
Return JSON ONLY.

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
  "clarity_explanation": "",
  "candidate_match_score": 0,
  "missing_core_skills": [],
  "resume_alignment_feedback": "",
  "rewrite_suggestions": []
}

Rules:
- candidate_match_score must be 0–100
- Limit true_core_skills to 5
- All arrays must be arrays (even if empty)
- Output MUST be valid JSON
- No markdown
- No commentary

Job Description:
"""
${jobDescription}
"""

Resume:
"""
${resumeText || "No resume provided."}
"""
`;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
      }
    );

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      console.error("Invalid OpenAI response:", data);
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
  console.log("ReadTheRole running on port 3000");
});
