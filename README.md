# Adaptive Tutoring System (Grade 6 Patterns)

A modular ATS with:
- **Domain module** (chapter → subtopic → concept → questions)
- **Learner model** (mastery, accuracy, attempts, hints, error type, interaction history)
- **Pedagogical engine** (mastery gating, adaptive question difficulty, attempt-based hint/explanation/remedial flow, error-type adaptation)

## Run

```bash
npm install
npm start
```

Open: `http://localhost:3000`

## API Endpoints

- `GET /chapter`
- `GET /subtopic?chapterId=ch1`
- `GET /concept?subtopicId=st1`
- `GET /learner?userId=demo-user`
- `POST /update-learner`
- `GET /next-question?userId=demo-user&conceptId=c1`
- `POST /submit-answer`

## Database Tables

- chapters
- subtopics
- concepts
- questions
- learners
- sessions
