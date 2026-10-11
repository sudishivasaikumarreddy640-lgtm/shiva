# Forma | Smart Project Team Formation

A React dashboard and Spring Boot API for staffing projects by skill fit, seniority, and availability.

## Requirements

- Node.js 18 or newer and npm
- Java 17 or newer
- Maven 3.9 or newer
- MySQL 8 or newer

## Run the app

Create a MySQL database and application user (or use a local development MySQL account):

```sql
CREATE DATABASE team_matcher;
CREATE USER 'team_matcher'@'localhost' IDENTIFIED BY 'choose-a-password';
GRANT ALL PRIVILEGES ON team_matcher.* TO 'team_matcher'@'localhost';
```

Set the connection values in the backend terminal before starting the API. The defaults target a local MySQL server at `localhost:3306`, database `team_matcher`, and the `root` account with an empty password; if your MySQL account requires a password, set it here:

```powershell
$env:DB_USERNAME = "team_matcher"
$env:DB_PASSWORD = "choose-a-password"
```

The API creates or updates its tables on startup and inserts the bundled demo projects and members only when their respective tables are empty. Existing database records are preserved. Override `DB_URL` to connect to a different MySQL host or database.

Start the API in one terminal:

```powershell
cd backend
mvn spring-boot:run
```

Start the frontend in a second terminal from the project root:

```powershell
npm install
npm run dev
```

Open the Vite address shown in the terminal (normally `http://localhost:5174`). The dashboard also works without the API using bundled demo data. Projects created while offline remain in the browser session only.

## API

- `GET /api/projects` returns seeded projects.
- `POST /api/projects` creates a project with required skills.
- `GET /api/members` returns the team directory.
- `GET /api/projects/{projectId}/matches` ranks members by overlapping skills (70%), availability (20%), and seniority (10%).

Project and member data is persisted in MySQL. The Vite development server is allowed by CORS on ports 5173 and 5174. Run backend tests with `cd backend; mvn test`.