async function analyze() {
  const jd = document.getElementById("jdInput").value.trim();
  const results = document.getElementById("results");

  if (!jd) {
    results.innerHTML = "<p>Please paste a job description.</p>";
    return;
  }

  results.innerHTML = "<p><strong>Analyzing role intent…</strong></p>";

  let data;
  try {
    const res = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: jd })
    });

    data = await res.json();
  } catch {
    results.innerHTML = "<p>Something went wrong. Please try again.</p>";
    return;
  }

  window.studyTopicsText = Array.isArray(data.study_topics)
    ? data.study_topics.join("\n")
    : "";

  results.innerHTML = `
    ${section("Role Scope Reality", `<p>${safe(data.role_scope_reality)}</p>`)}

    ${section(
      "True Core Skills (What You’ll Be Tested On)",
      list(data.true_core_skills)
    )}

    ${section(
      "Nice-to-Haves",
      list(data.nice_to_haves)
    )}

    ${section(
      "Interview Signal",
      `
        <strong>Focus Areas:</strong>
        ${list(data.interview_signal?.focus_areas)}
        <strong>Likely Questions:</strong>
        ${list(data.interview_signal?.sample_questions)}
      `
    )}

    ${section(
      "Resume Positioning",
      `
        <p><strong>Angle:</strong> ${safe(data.resume_positioning?.angle)}</p>
        <strong>Emphasize:</strong>
        ${list(data.resume_positioning?.emphasize)}
      `
    )}

    ${section(
      "Study Topics to Brush Up On",
      `
        ${list(data.study_topics)}
        <button onclick="copyStudyTopics()">Copy Study List</button>
      `
    )}

    ${section(
      "Role Clarity Score",
      `
        <p><strong>${safe(data.clarity_score)} / 100</strong></p>
        <p class="muted">${safe(data.clarity_explanation)}</p>
      `
    )}
  `;
}

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
  return `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
}

function safe(value) {
  return value ?? "";
}

function copyStudyTopics() {
  navigator.clipboard.writeText(window.studyTopicsText || "");
  alert("Study topics copied to clipboard!");
}
