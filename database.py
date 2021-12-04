from flask_sqlalchemy import SQLAlchemy
from app import db
import pickle
from datetime import date, datetime, timedelta
from models import UserCredential, Habit
from flask_login import current_user

def getPieChartData():
    """
    This function is used to determine how many habits were completed by a user
    each day for the current calendar week
    
    Returns:
    completion_counts: A list of 7 integers, where each integer represents how many habits were completed 
    on a specific day of the calendar week starting with Monday and ending with Sunday.
    
    example output: [3,5,4,0,2,0,0]
    This means that 3 habits were completed on Monday, 5 habits on Tuesday, 4 habits on Wednesday and so on.
    """

    week_habits = getCalendarWeekAndHabits()
    completion_counts = [0,0,0,0,0,0,0]

    for habit_dict in week_habits:
        current_week = habit_dict['dates_completed']
        for i in range(len(current_week)):
            current_completion = current_week[i]['completed']
            if current_completion  == True:
                completion_counts[i] += 1

    return(completion_counts)

def getUserHabits():
    user_habits = Habit.query.filter_by(user=current_user.id).all() #temporarily hardcoded
    return user_habits


def getCalendarWeekAndHabits():
    """
    This function is used to send user habit data to the client.

    Returns:
        A list of dictionaries which contain the current user's habit title and an array of dictionaries 
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
        #future improvement: just have habit title as key and dates completed as value
        habits.append({
            "habit_title": habit.title,
            "dates_completed": current_week_completed,
        })

    ordered_habits = orderHabitList(habits)
    return ordered_habits

def getPastWeekAndHabits():
    """
    This function is used to send user habit data to the client.

    Returns:
        A list of dictionaries which contains the current user's habit title and an array of dictionaries 
        whose keys are the dates of the past week (last 6 days and current date) and values are either True
        or False depending on if the habit was completed on that day 
    """

    user_habits = getUserHabits()
    habits = []
    for habit in user_habits:
        completed_dates = pickle.loads(habit.dates_completed)
        past_weeks_dates = getPastNDates(6) #previous 6 days and today

        past_week_completed = []
        for week_date in past_weeks_dates:
            if(week_date in completed_dates):
                completed = True
            else: 
                completed = False
            past_week_completed.append({
                'date': week_date.strftime("%Y-%m-%d"),
                'completed':completed
            })

        habits.append({
            "habit_title": habit.title,
            "dates_completed": past_week_completed,
        })

    ordered_habits = orderHabitList(habits)
    return ordered_habits

def getPastMonthAndHabits():
    """
    This function is used to send user habit data to the client.

    Returns:
        A list of dictionaries which contains the current user's habit title and an array of dictionaries 
        whose keys are the dates of the past month (last 29 days and current date) and values are either True
        or False depending on if the habit was completed on that day 
    """

    user_habits = getUserHabits()
    habits = []
    for habit in user_habits:
        completed_dates = pickle.loads(habit.dates_completed)
        past_months_dates = getPastNDates(29) #previous 29 days and today

        current_month_completed = []
        for month_date in past_months_dates:
            if(month_date in completed_dates):
                completed = True
            else: 
                completed = False
            current_month_completed.append({
                'date': month_date.strftime("%Y-%m-%d"),
                'completed':completed
            })

        habits.append({
            "habit_title": habit.title,
            "dates_completed": current_month_completed,
        })

    ordered_habits = orderHabitList(habits)
    return ordered_habits

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

    week_dates = getPastNDates(days_backward)
    for i in range(1,(days_forward+1)):
        current_date = today + timedelta(days=i)
        week_dates.append(current_date)

    return week_dates



def getPastNDates(num_days):
    """
    This function is used to get the dates of some N number of days backwards from today.

    Input:
        num_days: number of days from today to get the dates for (if num_days = 1, only yesterday's and
        today's dates will be returned. if num_days = 6, dates for the past week and today will be returned)
            pass in 6 for past week
            pass in 29 for past month
    Returns:
        A list which contains num_days + 1 dates, including today's.
    """
    today = date.today()
    dates = []
    for i in range(num_days, 0, -1):
        current_date = today - timedelta(days = i)
        dates.append(current_date)
    
    dates.append(today)
    return(dates)


def getPastNDayNumbers(num_days):
    """
    This function is used to get the day numbers of some N number of days backwards from today.

    Input:
        num_days: number of days from today to get the dates for (if num_days = 1, only yesterday's and
        today's dates will be returned. if num_days = 6, dates for the past week and today will be returned)
            pass in 6 for past week
            pass in 29 for past month
    Returns:
        A list which contains num_days + 1 days, including today's.
    """

    today = date.today()
    day_numbers = []
    for i in range(num_days, 0, -1):
        current_date = today - timedelta(days = i)
        day_numbers.append(current_date.day)
    
    day_numbers.append(today.day)
    return(day_numbers)


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


def orderHabitList(unorderd_dict_list):
    ordered_list = sorted(unorderd_dict_list, key = lambda i: i['habit_title'])
    return ordered_list



def getBWMonthHabits():

    best_habits= {}
    worst_habits = {}
    highest_count = float('-inf')
    lowest_count = float('inf')

    user_habits = getUserHabits()
    habits = []
    for habit in user_habits:
        current_count = 0
        completed_dates = pickle.loads(habit.dates_completed)
        past_months_dates = getPastNDates(29) #previous 29 days and today

        current_month_completed = []
        for month_date in past_months_dates:
            if(month_date in completed_dates):
                current_count += 1

        if current_count >= highest_count:
            highest_count = current_count
            best_habits[habit.title] = current_count

        if current_count <= lowest_count:
            lowest_count = current_count
            worst_habits[habit.title] = current_count
        
        final_best_habits = [k for k,v in best_habits.items() if v == highest_count]
        final_worst_habits = [k for k,v in worst_habits.items() if v == lowest_count]



    best_habit_str = "You've completed " + ', '.join(final_best_habits) + " the most in the past month! \n Completed: " + str(highest_count) + " days"   
    worst_habit_str = "You've completed " + ', '.join(final_worst_habits)+ " the least in the past month. \n Completed:  " + str(lowest_count) + " days"   
    return [best_habit_str, worst_habit_str] 

def getBWWeekHabits():

    best_habits = {}
    worst_habits = {}
    highest_count = float('-inf')
    lowest_count = float('inf')

    user_habits = getUserHabits()
    habits = []
    for habit in user_habits:
        current_count = 0
        completed_dates = pickle.loads(habit.dates_completed)
        past_weeks_dates = getPastNDates(6) #previous 6 days and today

        current_month_completed = []
        for week_date in past_weeks_dates:
            if(week_date in completed_dates):
                current_count += 1

        if current_count >= highest_count:
            highest_count = current_count
            best_habits[habit.title] = current_count

        if current_count <= lowest_count:
            lowest_count = current_count
            worst_habits[habit.title] = current_count
        
        final_best_habits = [k for k,v in best_habits.items() if v == highest_count]
        final_worst_habits = [k for k,v in worst_habits.items() if v == lowest_count]

    best_habit_str = "You've completed " + ', '.join(final_best_habits) + " the most in the past seven days! \n Completed: " + str(highest_count) + " days"   
    worst_habit_str = "You've completed " + ', '.join(final_worst_habits)+ " the least in the past seven days. \n Completed:  " + str(lowest_count) + " days"   
    return [best_habit_str, worst_habit_str] 


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

