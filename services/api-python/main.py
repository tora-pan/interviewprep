import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from src.db.session import engine
from src.db.user import Base
from src.modules.auth.routes import router as auth_router


app = FastAPI(
    title="InterviewPrep API",
    version="0.1.0",
)


def initialize_database() -> None:
    for attempt in range(5):
        try:
            Base.metadata.create_all(bind=engine)
            return
        except OperationalError:
            if attempt == 4:
                raise
            time.sleep(1)


@app.on_event("startup")
def on_startup() -> None:
    initialize_database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# register all module routers
app.include_router(auth_router)


@app.get("/health")
def health():
    return {"status": "ok"}
