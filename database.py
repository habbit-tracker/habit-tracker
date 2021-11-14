import flask
from flask_sqlalchemy import SQLAlchemy
from app import db
import pickle
from datetime import date
import datetime
import time
from models import UserCredential, Habit
from flask_login import current_user

def getUserHabits():
    #user_habits = UserCredential.query.filter_by(user=current_user.id).all()
    user_habits = Habit.query.filter_by(user=10).all() #temporarily hardcoded
    habits = []
    for habit in user_habits:
        completed_dates = pickle.loads(habit.dates_completed)
        this_weeks_dates = getThisWeeksDates()
        current_week_completed = []
        for week_date in this_weeks_dates:
            if(week_date in completed_dates):
                completed = True
            else: 
                completed = False
            current_week_completed.append({
                'date': week_date.strftime("%Y-%m-%d"),
                'completed':completed
            })

        habits.append({
            "habit_title": habit.title,
            "dates_completed": current_week_completed,
        })

    return habits


def addUserHabit(client_json):
    #takes binary string ie '1100100' and converts to int
    target_days_str = client_json['target_days_str']
    target_days_bin = bin(int(target_days_str,2))
    target_days_int = int(target_days_bin, 2)

    habit = Habit(
        user = 10, #hardcoded user id for test purposes, will update once login functionality is complete
        title = client_json['title'],
        category = client_json['category'],
        date_created = date.today(),
        target_days = target_days_int,
        dates_completed = pickle.dumps([]),
    )

    db.session.add(habit)
    db.session.commit()


def getThisWeeksDates():
    today = date.today()
    year, week_num, day_of_week = today.isocalendar()

    days_forward = 7 - day_of_week
    days_backward = 6 - days_forward
    week_dates = []
    for i in range(days_backward, 0,-1):
        current_date = today - datetime.timedelta(days=i)
        week_dates.append(current_date)
    week_dates.append(today)
    for i in range(1,(days_forward+1)):
        current_date = today + datetime.timedelta(days=i)
        week_dates.append(current_date)

    return week_dates


def addTestHabit():
    today = date.today()
    test_dates = []
    for i in range(1,4):
        current_date = today - datetime.timedelta(days=i)
        test_dates.append(current_date)

    habit = Habit(
    user = 10, #hardcoded user id for test purposes, will update once login functionality is complete
    title = 'test the squares',
    category = 'school',
    date_created = date.today(),
    target_days = 32,
    dates_completed = pickle.dumps(test_dates),
    )

    db.session.add(habit)
    db.session.commit()