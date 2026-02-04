"""
Database configuration and connection management.
Provides async SQLAlchemy engine and session management for Neon PostgreSQL.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel
from .config import settings


# Create async engine for Neon PostgreSQL
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before using
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    """
    Dependency for getting database sessions.
    Yields an async session and ensures it's closed after use.
    """
    async with async_session_maker() as session:
        yield session


async def init_db():
    """
    Initialize database by creating all tables.
    Should be called on application startup.
    """
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db():
    """
    Close database connections.
    Should be called on application shutdown.
    """
    await engine.dispose()
