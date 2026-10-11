# Project Guidance

- Keep the frontend in React with Vite and JavaScript. Preserve the existing compact, responsive Forma dashboard style.
- Keep API payloads aligned with the records in `backend/src/main/java/com/forma/teammatcher/model` and the demo data in `src/data.js`.
- Matching ranks skill overlap, availability, and seniority. Keep the frontend fallback and Spring service behavior consistent.
- Run `npm run build` for frontend validation and `cd backend; mvn test` for backend tests. The API targets Java 17 and Spring Boot 3.
- The API currently uses in-memory seed data; do not imply persistence unless a database is added.