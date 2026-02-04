"""
Configuration management for the application.
Loads environment variables and provides settings.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # JWT Configuration
    BETTER_AUTH_SECRET: str

    # Database Configuration
    DATABASE_URL: str

    # Application Settings
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS_ORIGINS string to list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
