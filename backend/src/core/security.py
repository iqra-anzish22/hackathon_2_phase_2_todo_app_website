"""
Security utilities for JWT verification and authentication.
Handles JWT token validation using python-jose.
"""
from jose import JWTError, jwt, ExpiredSignatureError
from .config import settings
from .errors import AppException, ERROR_TOKEN_EXPIRED, ERROR_INVALID_TOKEN


def verify_jwt(token: str) -> dict:
    """
    Verify JWT token and return payload.

    Args:
        token: JWT token string

    Returns:
        dict: Token payload with validated claims

    Raises:
        AppException: 401 with specific error code (TOKEN_EXPIRED or INVALID_TOKEN)
    """
    try:
        # Decode and verify token
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )

        # Validate required claims
        user_id: str = payload.get("sub")

        if not user_id:
            raise AppException(
                status_code=401,
                error_code=ERROR_INVALID_TOKEN,
                message="Invalid authentication token. Please sign in again."
            )

        return payload

    except ExpiredSignatureError:
        raise AppException(
            status_code=401,
            error_code=ERROR_TOKEN_EXPIRED,
            message="Your session has expired. Please sign in again."
        )
    except JWTError:
        raise AppException(
            status_code=401,
            error_code=ERROR_INVALID_TOKEN,
            message="Invalid authentication token. Please sign in again."
        )
