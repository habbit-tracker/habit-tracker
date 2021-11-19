from flask_sqlalchemy import SQLAlchemy
from app import db
import pickle
from datetime import date, datetime, timedelta
from models import UserCredential, Habit
from flask_login import current_user

def getUserHabits():
    user_habits = Habit.query.filter_by(user=current_user.id).all() #temporarily hardcoded
    return user_habits


def getCalendarWeekAndHabits():
    """
    This function is used to send user habit data to the client.

    Returns:
        A dictionary which contains the current user's habit title and an array of dictionaries 
        whose keys are the dates of the current week (from Mon-Friday) and values are either True
        or False depending on if the habit was completed on that day 
    """

    user_habits = getUserHabits()
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

def getPastWeekAndHabits():
    """
    This function is used to send user habit data to the client.

    Returns:
        A dictionary which contains the current user's habit title and an array of dictionaries 
        whose keys are the dates of the past week (last 6 days and current date) and values are either True
        or False depending on if the habit was completed on that day 
    """

    user_habits = getUserHabits()
    habits = []
    for habit in user_habits:
        completed_dates = pickle.loads(habit.dates_completed)
        past_weeks_dates = getPastNDates(6) #previous 6 days and today

        current_week_completed = []
        for week_date in past_weeks_dates:
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
        user = current_user.id,
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
    #could do week_dates = getPastNDates(days_backwards) and delete next 4 lines
    #test this
    week_dates = getPastNDates(days_backward)
    # for i in range(days_backward, 0,-1):
    #     current_date = today - timedelta(days=i)
    #     week_dates.append(current_date)
    # week_dates.append(today)
    for i in range(1,(days_forward+1)):
        current_date = today + timedelta(days=i)
        week_dates.append(current_date)

    return week_dates


# def getThisMonthsDates():
#     today = date.today()

def getPastNDates(num_days):
    """
    This function is used to get the dates of some N number of days backwards from today.

    Input:
        num_days: number of days from today to get the dates for (if num_days = 1, only yesterday's and
        today's dates will be returned. if num_days = 6, dates for the past week and today will be returned)
            pass in 6 for past week
            pass in 29 for past month
    Returns:
        An array which contains num_days + 1 dates, including today's.
    """
    today = date.today()
    dates = []
    for i in range(num_days, 0, -1):
        current_date = today - timedelta(days = i)
        dates.append(current_date)
    
    dates.append(today)
    return(dates)


def addCompletionDate(client_json):
    habit_title = client_json['title']
    date_string = client_json['date']

    habit = Habit.query.filter_by(title=habit_title, user=current_user.id).first() #update user id after merge
    date_object = datetime.strptime(date_string, "%Y-%m-%d").date()

    completed_dates = pickle.loads(habit.dates_completed)

    already_completed = False
    if date_object in completed_dates:
        already_completed = True

    if already_completed == False:
        completed_dates.append(date_object)
        habit.dates_completed = pickle.dumps(completed_dates)
        db.session.commit()


def removeCompletionDate(client_json):
    habit_title = client_json['title']
    date_string = client_json['date']

    habit = Habit.query.filter_by(title=habit_title, user=current_user.id).first() 
    date_object = datetime.strptime(date_string, "%Y-%m-%d").date()

    completed_dates = pickle.loads(habit.dates_completed)
    if date_object in completed_dates:
        completed_dates.remove(date_object)
        habit.dates_completed = pickle.dumps(completed_dates)
        db.session.commit()



def addTestHabit():
    today = date.today()
    test_dates = []
    for i in range(1,4):
        current_date = today - timedelta(days=i)
        test_dates.append(current_date)

    habit = Habit(
    user = 10,
    title = 'drink water',
    category = 'body',
    date_created = date.today(),
    target_days = 64,
    dates_completed = pickle.dumps(test_dates),
    )

    db.session.add(habit)
    db.session.commit()

