# ReadTheRole

**Read between the lines of job descriptions.**

ReadTheRole is a lightweight web application designed to help job seekers—especially those impacted by layoffs—understand what companies are *actually* looking for when they post a job.

Instead of applying and interviewing blindly, ReadTheRole restores context by analyzing job descriptions and turning them into actionable preparation guidance.

---

## Why This Exists

After being laid off, I found myself reading job descriptions differently.

They felt vague. Inflated. Overwhelming.

Most job descriptions are written to cover legal, aspirational, and future needs—not to clearly communicate what candidates will be evaluated on in interviews. When you're laid off, that lack of clarity costs time, energy, and confidence.

ReadTheRole was built to answer questions like:

- What is this role *really*?
- What skills will they actually test?
- What should I study—and what can I safely deprioritize?
- How should I frame my experience for *this* role?

---

## What ReadTheRole Does

Paste a job description into the app and receive:

- **Role Scope Reality**  
  A plain-English explanation of what the role likely entails day-to-day.

- **True Core Skills**  
  The top skills most likely to be evaluated in interviews.

- **Nice-to-Haves**  
  Secondary signals that are helpful but unlikely to block hiring.

- **Interview Signal**  
  Focus areas and sample interview questions you’re likely to encounter.

- **Resume Positioning**  
  How to emphasize your experience to align with how the role is evaluated.

- **Study Topics**  
  Concrete concepts to review so prep is intentional, not guesswork.

- **Role Clarity Score**  
  A score (with explanation) indicating how well-defined the role is.

## Tech Stack

- **Frontend:**  
  Vanilla HTML, CSS, JavaScript (no frameworks)

- **Backend:**  
  Node.js, Express

- **AI:**  
  OpenAI API (strict JSON-enforced responses)

- **Hosting:**  
  Render

This project intentionally avoids heavy frameworks to keep the MVP fast, readable, and easy to reason about.

---

## Notable Technical Decisions

### Defensive AI Handling
AI output is not assumed to be perfect. The app enforces strict JSON responses at the API level and guards against malformed data on the frontend to prevent UI crashes.

### Human-Readable Output
Instead of dumping raw JSON, the UI renders collapsible, scannable sections that reduce cognitive load during stressful job searches.

### Graceful Failure
If something goes wrong—network issues, API errors, missing data—the app fails calmly and clearly instead of breaking.

---

## Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/readtherole.git
cd readtherole
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add enviornment variable
## Create a .env file in the root:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Start the server
```bash
npm start
```

### 5. Open the app
```bash
http://localhost:3000
```


