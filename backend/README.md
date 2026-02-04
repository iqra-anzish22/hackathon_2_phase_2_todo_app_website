# Multi-User Todo Backend

FastAPI backend for the Multi-User Todo Web Application with JWT authentication and PostgreSQL storage.

## Prerequisites

- Python 3.11+
- Neon PostgreSQL account (or local PostgreSQL)
- Virtual environment tool (venv)

## Setup

1. Create and activate virtual environment:
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. Run database migrations:
```bash
alembic upgrade head
```

## Running the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

API documentation: http://localhost:8000/docs

## Project Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI app entry point
│   ├── models/              # SQLModel database models
│   ├── schemas/             # Pydantic request/response schemas
│   ├── api/                 # API routes and dependencies
│   └── core/                # Configuration, database, security
├── tests/                   # Test files
├── requirements.txt         # Python dependencies
└── .env.example            # Environment variable template
```

## Environment Variables

- `BETTER_AUTH_SECRET`: JWT signing secret (must match frontend)
- `DATABASE_URL`: PostgreSQL connection string
- `DEBUG`: Enable debug mode (true/false)
- `CORS_ORIGINS`: Allowed CORS origins (frontend URL)

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

## Development

Run tests:
```bash
pytest tests/ -v
```

Format code:
```bash
black src/
```

Lint code:
```bash
flake8 src/
```
