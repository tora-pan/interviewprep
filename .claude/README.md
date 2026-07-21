# Claude project setup (minimal)

This folder contains only the essentials for developing this repository with Claude:

- `settings.json`: safe, project-scoped command permissions.
- `agents/frontend-react.md`: React + TypeScript + Vite specialist.
- `agents/api-python.md`: FastAPI + SQLAlchemy + Alembic specialist.

## Recommended usage

- Use the default Claude agent for general cross-service tasks.
- Use `frontend-react` for UI/features in `apps/frontend`.
- Use `api-python` for API/database/auth work in `services/api-python`.

## Project commands Claude can run

Frontend (`apps/frontend`):
- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`

Python API (`services/api-python`):
- `uv sync`
- `uv run uvicorn interviewprep_api.main:app --reload`
- `uv run alembic -c alembic.ini upgrade head`
- `uv run ruff check .`
- `uv run mypy`

Infra:
- `docker compose up --build`
