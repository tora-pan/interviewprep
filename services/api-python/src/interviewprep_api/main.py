from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from interviewprep_api.modules.auth.routes import router as auth_router

app = FastAPI(
    title="InterviewPrep API",
    version="0.1.0",
)

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
