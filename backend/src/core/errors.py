"""
Custom exception classes and error handling utilities.
Provides standardized error responses across all API endpoints.
"""
from typing import Optional, List
from fastapi import HTTPException


class ErrorDetail:
    """Field-level error detail for validation errors."""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message

    def dict(self):
        return {"field": self.field, "message": self.message}


class AppException(HTTPException):
    """
    Custom application exception with structured error response.

    Extends FastAPI's HTTPException to include error_code and optional field-level details.
    """
    def __init__(
        self,
        status_code: int,
        error_code: str,
        message: str,
        details: Optional[List[ErrorDetail]] = None
    ):
        self.error_code = error_code
        self.message = message
        self.details = details
        super().__init__(status_code=status_code, detail=message)


# Error code constants for consistent error handling

# Authentication errors (HTTP 401)
ERROR_MISSING_TOKEN = "MISSING_TOKEN"
ERROR_TOKEN_EXPIRED = "TOKEN_EXPIRED"
ERROR_INVALID_TOKEN = "INVALID_TOKEN"

# Authorization errors (HTTP 403)
ERROR_FORBIDDEN = "FORBIDDEN"
ERROR_OWNERSHIP_CHANGE_FORBIDDEN = "OWNERSHIP_CHANGE_FORBIDDEN"

# Resource errors (HTTP 404)
ERROR_TASK_NOT_FOUND = "TASK_NOT_FOUND"

# Validation errors (HTTP 422)
ERROR_VALIDATION_ERROR = "VALIDATION_ERROR"

# Server errors (HTTP 500)
ERROR_INTERNAL_ERROR = "INTERNAL_ERROR"
