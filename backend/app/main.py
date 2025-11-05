from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from dotenv import load_dotenv
import os

from .db import init_db, get_session
from .models import User
from .schemas import UserCreate, UserResponse, Token
from .auth import get_password_hash, verify_password, create_access_token
from .deps import get_current_user
from .routes import graph, algorithms

load_dotenv()

app = FastAPI(title="PathFinder API", version="1.0.0")

# CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Inicializar DB al arrancar
@app.on_event("startup")
def on_startup():
    init_db()
    print("✅ Database initialized")


# ========== AUTH ROUTES ==========
@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """Registra un nuevo usuario"""
    statement = select(User).where(User.username == user_data.username)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    user = User(username=user_data.username, hashed_password=hashed_password)
    
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return UserResponse(id=user.id, username=user.username) # type: ignore


@app.post("/auth/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """Login y obtención de token JWT"""
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return Token(access_token=access_token)


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Obtiene información del usuario actual"""
    return UserResponse(id=current_user.id, username=current_user.username) # type: ignore


# Include routers
app.include_router(graph.router, prefix="/graph", tags=["graph"])
app.include_router(algorithms.router, prefix="/graph", tags=["algorithms"])


@app.get("/")
def root():
    return {"message": "PathFinder API - Use /docs for documentation"}