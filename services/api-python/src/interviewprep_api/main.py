from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from interviewprep_api.modules.auth.routes import router as auth_router
from interviewprep_api.modules.applications.routes import router as applications_router
from interviewprep_api.modules.leetcode.routes import router as leetcode_router
from interviewprep_api.db import application as _app_model  # noqa: F401
from interviewprep_api.db import leetcode as _lc_model  # noqa: F401

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
app.include_router(applications_router)
app.include_router(leetcode_router)


@app.get("/health")
def health():
    return {"status": "ok"}
