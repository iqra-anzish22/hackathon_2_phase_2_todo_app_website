"""
FastAPI application entry point.
Initializes the app with CORS configuration and routes.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import init_db, close_db
from .core.errors import AppException
from .schemas.errors import ErrorResponse, ErrorDetail


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup: Initialize database
    await init_db()
    yield
    # Shutdown: Close database connections
    await close_db()


# Create FastAPI application
app = FastAPI(
    title="Multi-User Todo API",
    description="Secure REST API for multi-user todo management with JWT authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handlers

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """
    Handle custom AppException with structured error response.

    Returns ErrorResponse format with error_code, message, and optional details.
    """
    error_response = ErrorResponse(
        error_code=exc.error_code,
        message=exc.message,
        details=[detail.dict() for detail in exc.details] if exc.details else None
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(exclude_none=True)
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle Pydantic validation errors with structured error response.

    Converts Pydantic validation errors into ErrorResponse format with field-level details.
    """
    details = []
    for error in exc.errors():
        # Extract field name from error location (skip 'body' prefix)
        field = '.'.join(str(loc) for loc in error['loc'] if loc != 'body')
        details.append(ErrorDetail(
            field=field,
            message=error['msg']
        ))

    error_response = ErrorResponse(
        error_code="VALIDATION_ERROR",
        message="Invalid input data",
        details=details
    )

    return JSONResponse(
        status_code=422,
        content=error_response.model_dump(exclude_none=True)
    )


@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {
        "message": "Multi-User Todo API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Import and register routers
from .api.routes import tasks

app.include_router(tasks.router, prefix="/api", tags=["tasks"])
