# Client Project Tracker

A full-stack project management dashboard for a digital agency. The application allows project managers to create, edit, view, and delete client projects, with validation for required fields and date logic.

## Project Overview

This app includes:

- Laravel REST API backend for project CRUD operations
- React frontend for project management
- Project list in a table with expandable details, search, status filtering, priority filtering, and pagination
- Seeded sample data for a realistic dashboard experience
- Validation for required fields, valid status/priority values, and start/due date rules

## Tech Stack

- Backend: Laravel 13 + PHP 8.3
- Frontend: React + Vite
- Database: MySQL (configured for local development)
- API styling: JSON responses via Laravel routes and controllers
- Validation: Laravel FormRequest validation rules

## Setup Instructions

### 1. Install backend dependencies

```bash
cd backend
composer install
```

### 2. Configure environment

The project includes a Laravel environment file already configured for local development. If needed, verify the database settings in `backend/.env`.

### 3. Run database migrations and seed sample data

```bash
cd backend
php artisan migrate --seed
```

### 4. Start the Laravel API

```bash
cd backend
php artisan serve --host 127.0.0.1 --port 8000
```

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

### 6. Start the frontend app

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open:

- Frontend: http://localhost:5174
- API: http://127.0.0.1:8000/api/projects

## How to Run the Application

From the project root:

1. Start the backend API
2. Start the frontend development server
3. Open the frontend URL in the browser

The app will load the seeded project list and allow you to:

- create a new project
- edit an existing project
- delete a project
- search projects
- filter by status and priority
- view project details in the expandable table row

## Assumptions Made

- This is a single-user internal agency tool, so authentication was not required.
- The project supports the required status and priority values exactly as specified.
- Due date must be on or after the start date, which is enforced in validation.
- The app uses a local database setup rather than Docker or deployment infrastructure.
- The sample dataset is seed-based and can be replaced with real data later.

## API Behavior

The backend API supports the required CRUD operations:

- GET /api/projects
- GET /api/projects/{id}
- POST /api/projects
- PUT /api/projects/{id}
- DELETE /api/projects/{id}

Validation includes:

- client name required
- project name required
- valid status required
- valid priority required
- due date not before start date
- meaningful validation errors returned in JSON format

## Technical Reflection

### 1. Why did you choose this implementation approach?

I chose a simple full-stack architecture using Laravel for the backend and React for the frontend because it matches the project requirement well and keeps the implementation easy to reason about. Laravel provides strong validation, routing, and database tooling out of the box, while React is ideal for a responsive dashboard-style interface with quick interaction updates.

### 2. What tradeoffs did you make?

The main tradeoff was keeping the architecture intentionally lightweight rather than adding authentication, more advanced data modeling, or a heavier state management tool. This keeps the solution focused on the project requirement and reduces unnecessary complexity. I also kept the UI as a single-page dashboard with a table and expandable detail rows rather than introducing a more elaborate drag-and-drop or analytics-heavy design.

### 3. What would you improve if given additional time?

If more time were available, I would improve this by adding:

- sorting by columns
- clearer status/priority KPI summaries
- a dedicated project detail page or modal
- improved accessibility and keyboard interaction
- test coverage for frontend and backend edge cases
- optional authentication and user-specific project ownership

### 4. What was the most challenging part of this assessment?

The most challenging part was balancing the required functionality with a clean UI while keeping the app simple and aligned with the optional requirements. The main challenge was making sure the project list remained readable while still supporting create/edit/delete flows, validation, search, filtering, and pagination without overcrowding the interface.

### 5. Did you use AI tools during development?

Yes.

Tools used:

- GitHub Copilot in the editor

How they were used:

- scaffolding the Laravel and React app structure
- generating initial CRUD logic and validation patterns
- helping create the project UI and layout
- debugging build issues and API route setup
- reviewing code quality and improving the final implementation

## Notes

This project was built to satisfy the assessment requirements with a clean, practical implementation that can be extended later. It intentionally keeps the scope focused on the tracker function without adding optional complexity that is not required by the brief.
