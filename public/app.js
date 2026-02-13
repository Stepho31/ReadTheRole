async function analyze() {
  const jd = document.getElementById("jdInput").value.trim();
  const resumeFile = document.getElementById("resumeInput").files[0];
  const results = document.getElementById("results");

  if (!jd) {
    results.innerHTML = "<p>Please paste a job description.</p>";
    return;
  }

  results.innerHTML = "<p><strong>Analyzing role intent…</strong></p>";

  const formData = new FormData();
  formData.append("jobDescription", jd);

  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  let data;

  try {
    const res = await fetch("/analyze", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      results.innerHTML = `<p>Server error: ${errorText}</p>`;
      return;
    }

    data = await res.json();

  } catch (err) {
    console.error("Frontend fetch error:", err);
    results.innerHTML =
      "<p>Something went wrong while contacting the server.</p>";
    return;
  }

  // Defensive fallback values
  const matchScore = safe(data?.candidate_match_score);
  const alignmentFeedback = safe(data?.resume_alignment_feedback);

  results.innerHTML = `
  ${section(
    "Candidate Match Score",
    `
      <p><strong>${safe(data?.candidate_match_score)} / 100</strong></p>
      <p>${safe(data?.resume_alignment_feedback)}</p>
    `
  )}

  ${section(
    "Missing Core Skills",
    list(data?.missing_core_skills)
  )}

  ${section(
    "Rewrite Suggestions",
    list(data?.rewrite_suggestions)
  )}

  ${section(
    "Interview Focus Areas",
    list(data?.interview_signal?.focus_areas)
  )}

  ${section(
    "Sample Interview Questions",
    list(data?.interview_signal?.sample_questions)
  )}

  ${section(
    "Role Scope Reality",
    `<p>${safe(data?.role_scope_reality)}</p>`
  )}

  ${section(
    "True Core Skills",
    list(data?.true_core_skills)
  )}

  ${section(
    "Nice-to-Haves",
    list(data?.nice_to_haves)
  )}

  ${section(
    "Study Topics",
    list(data?.study_topics)
  )}

  ${section(
    "Role Clarity Score",
    `
      <p><strong>${safe(data?.clarity_score)} / 100</strong></p>
      <p class="muted">${safe(data?.clarity_explanation)}</p>
    `
  )}
`;

}

/* ---------- Helper Functions ---------- */

function section(title, content) {
  return `
    <details open>
      <summary>${title}</summary>
      <div class="section-content">
        ${content}
      </div>
    </details>
  `;
}

function list(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "<p class='muted'>None identified</p>";
  }
  return `<ul>${items.map(i => `<li>${safe(i)}</li>`).join("")}</ul>`;
}

function safe(value) {
  return value ?? "";
}
