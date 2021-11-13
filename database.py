import flask
from flask_sqlalchemy import SQLAlchemy
from models import UserCredential, Habit
from flask_login import current_user

def getUserHabits() :
    #habits = UserCredential.query.filter_by(user=current_user.id).all()
    user_habits = Habit.query.filter_by(user=10).all() #temporarily hardcoded
    habits = []
    for habit in user_habits:
        habits.append({
            "habit_title": habit.title,
        })

    return habits