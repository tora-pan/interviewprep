FROM python:3.12-slim

WORKDIR /app
ENV PYTHONPATH=/app/src

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install uv

COPY services/api-python/ .

RUN uv sync

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "interviewprep_api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]