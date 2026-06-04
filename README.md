## `README.md`

```markdown
# AI Career Copilot 🚀

An AI-powered resume analysis tool for early career professionals in Malaysia & Singapore.

Upload your resume (PDF or DOCX) and instantly receive:
- ATS Score (0–100)
- Strengths analysis
- Improvement suggestions
- Actionable tips

Built with React + Vite + OpenAI + Supabase, deployed on Vercel.

---

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **AI:** OpenAI API (gpt-4o-mini)
- **Database:** Supabase (stats counter)
- **Deployment:** Vercel

---

## Project Structure

```
ai-career-copilot/
├── api/
│   └── analyze.js
├── src/
│   ├── components/
│   │   ├── UploadSection.jsx
│   │   ├── ResultSection.jsx
│   │   └── StatsBar.jsx
│   ├── lib/
│   │   ├── parseFile.js
│   │   └── supabase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

---

## Environment Variables

Create a `.env` file in the root folder:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ Never commit `.env` to GitHub. It is already in `.gitignore`.

---

## Supabase Setup

Run this in Supabase SQL Editor once:

```sql
create table if not exists stats (
  id int primary key default 1,
  total_resumes int default 0,
  total_users int default 0,
  feedback_count int default 0
);

insert into stats (id, total_resumes, total_users, feedback_count)
values (1, 10, 5, 0)
on conflict (id) do update
set total_resumes = 10, total_users = 5;

create or replace function increment_resumes()
returns void as $$
  update stats set total_resumes = total_resumes + 1 where id = 1;
$$ language sql;

create or replace function increment_users()
returns void as $$
  update stats set total_users = total_users + 1 where id = 1;
$$ language sql;
```

---

## 🖥️ Running Locally (localhost)

### First time setup
```bash
npm install
npm install -g vercel
vercel login
```

### Every time you want to test locally
```bash
vercel dev
```
Then open `http://localhost:3000` in your browser.

> ⚠️ Always use `vercel dev` (not `npm run dev`) so the `/api/analyze.js` backend runs too.

---

## ✅ Testing Before Push

1. Run `vercel dev`
2. Open `http://localhost:3000`
3. Upload a PDF or DOCX resume
4. Confirm ATS score and results appear
5. Check stats counter increments
6. Happy? Proceed to push.

---

## 🚀 Push to GitHub & Deploy to Vercel

### Every time you make changes:
```bash
# Step 1: Stage all changes
git add .

# Step 2: Commit with a message
git commit -m "describe what you changed"

# Step 3: Push to GitHub
git push

# Step 4: Deploy to Vercel production
vercel --prod
```

### First time only (if repo not linked yet):
```bash
git status # to check github status
git checkout . # to go back previous version
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-career-copilot.git
git push -u origin main
vercel --prod
```

---

## 📋 Common Issues

| Problem | Fix |
|--------|-----|
| `vercel` not recognized | Run `npm install -g vercel` |
| Stats showing 0 | Check Supabase RLS policy, run SQL setup again |
| OpenAI API error on live site | Check Environment Variables in Vercel Dashboard |
| PDF not parsing | File may be image-based, ask user to use text-based PDF |
| Recursive vercel error | Use `vercel dev` directly, not `npm run dev` |

---

## 🗺️ Roadmap

- **V1 (Current):** Resume upload → AI analysis → Feedback link
- **V2:** Subscription model, PDF export, cover letter generator
- **V3:** Job matching, industry-specific scoring
- **V4:** AI career agent, interview simulation

---

Built by Celeste · Malaysia 🇲🇾 · 2026
```
