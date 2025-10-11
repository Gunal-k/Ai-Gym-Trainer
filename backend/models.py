from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # This line now works because the "Workout" class is defined
    workouts = relationship("Workout", back_populates="owner")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    activity_type = Column(String, index=True) # e.g., "Running", "Weightlifting"
    duration_minutes = Column(Integer)
    calories_burned = Column(Integer, nullable=True)
    workout_date = Column(DateTime, default=datetime.utcnow)
    
    # This foreign key links each workout back to a specific user
    owner_id = Column(Integer, ForeignKey("users.id"))

    # This establishes the other side of the relationship
    owner = relationship("User", back_populates="workouts")