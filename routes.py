from app import app, bp, db
from models import UserCredential, Habit
from database import *
import os
import json
import requests
import flask
from flask_login import login_user, current_user, LoginManager, login_required, logout_user
from datetime import date
from piclinks import piclinks

import base64

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_name):
    """
    Required by flask_login
    """
    return UserCredential.query.get(user_name)


@bp.route('/index')
@login_required
def index():
    messages = getHabitMessages()
    DATA = {"habits": getCalendarWeekAndHabits(),
            "day_headers": ["M", "T", "W", "Th", "F", "S", "Su"],
            "messages": messages,
            "pie_chart_data": getPieChartData(),
            }
    data = json.dumps(DATA)
    return flask.render_template(
        "index.html",
        data=data,
    )


@bp.route('/create', methods=["POST"])
def createHabit():
    response_json = flask.request.json
    addUserHabit(response_json)

    view_headers = response_json['current_view_headers']
    DATA = getDataFromHeaders(view_headers)
    data = json.dumps(DATA)
    return(data)


@bp.route('/update-completion', methods=["POST"])
def updateCompletionDate():
    response_json = flask.request.json
    if response_json['action'] == 'adding':
        addCompletionDate(response_json)

    elif response_json['action'] == 'removing':
        removeCompletionDate(response_json)

    view_headers = response_json['current_view_headers']
    DATA = getDataFromHeaders(view_headers)

    data = json.dumps(DATA)
    return(data)


@bp.route('/update-view', methods=["POST"])
def getUserHabitView():
    response_json = flask.request.json
    # Briana: this can be done better, but I'm not sure of how rn
    view = response_json['view_string']
    if view == 'past_seven_days':
        DATA = {"habits": getPastWeekAndHabits(),
                "day_headers": getPastNDayNumbers(6),
                "messages": getHabitMessages(),
                }
    elif view == 'past_month':
        DATA = {"habits": getPastMonthAndHabits(),
                "day_headers": getPastNDayNumbers(29),
                "messages": getHabitMessages(),
                }
    else:
        DATA = {"habits": getCalendarWeekAndHabits(),
                "day_headers": ["M", "T", "W", "Th", "F", "S", "Su"],
                "messages": getHabitMessages(),
                }

    data = json.dumps(DATA)
    return(data)


app.register_blueprint(bp)


@app.route('/signup')
def signup():
    return flask.render_template("sign-up.html")


@app.route('/signup', methods=["POST"])
def signup_post():
    signup_username = flask.request.form.get('username')
    signup_email = flask.request.form.get('email')
    signup_password = flask.request.form.get('password')
    signup_password_confirm = flask.request.form.get('confirmpassword')

    input_signup_email = UserCredential.query.filter_by(
        email=signup_email).first()

    # Check if email already in database
    if input_signup_email:
        flask.flash("This email has already been used. Try something else!")
        return flask.redirect(flask.url_for("signup"))

    # Check if password and confirm does not matched
    if signup_password_confirm != signup_password:
        flask.flash("Your Password did not match. Try again!")
        return flask.redirect(flask.url_for("signup"))

    # Pass all conditions, add info to database with encrypted password
    else:
        encrypt_signup_password = base64.b64encode(
            signup_password.encode("utf-8"))
        signupuser = UserCredential(username=signup_username, email=signup_email,
                                    password=str(encrypt_signup_password))
        db.session.add(signupuser)
        db.session.commit()

        current_user = UserCredential.query.filter_by(
            email=signup_email).first()
        login_user(current_user)
        return flask.redirect(flask.url_for("bp.index"))


@app.route('/login')
def login():
    return flask.render_template("log-in.html")


@app.route('/login', methods=["POST"])
def login_post():
    login_email = flask.request.form.get('email')
    login_password = flask.request.form.get('password')
    encrypt_login_password = encodepassword(login_password)

    existing_user = UserCredential.query.filter_by(
        email=login_email, password=str(encrypt_login_password)).first()

    # Check if email and password match with database
    if not existing_user:
        flask.flash("Invalid email or password. Try again!")
        return flask.redirect(flask.url_for("login"))

    # Redirect user into main page if email and password matched
    else:
        login_user(existing_user)
        return flask.redirect(flask.url_for("bp.index"))


def encodepassword(password):
    return base64.b64encode(password.encode("utf-8"))


@app.route("/logout")
def logout_page():
    # variable=current_user.username
    logout_user()
    flask.flash("You have logged out!")
    return flask.render_template("logout.html",)


@app.route('/profile')
def profile():
    i = current_user.id % 5
    return flask.render_template("profile.html", currentuser=current_user, loginmanager=login_user, piclinks=piclinks[i])


@app.route('/contactus')
def contactus():
    return flask.render_template("contact_us.html")


@app.route('/about')
def about():
    return flask.render_template("about.html")


@app.route('/changepassword')
def changepassword():
    return flask.render_template("change-password.html")


@app.route('/changepassword', methods=["POST"])
def changepassword_post():
    currentpassword = flask.request.form.get('currentpassword')
    newpassword = flask.request.form.get('newpassword')
    newpassword_confirm = flask.request.form.get('confirmnewpassword')
    encrypt_changed_currentpassword = encodepassword(currentpassword)

    validate_userpassword = UserCredential.query.filter_by(
        email=current_user.email, password=str(encrypt_changed_currentpassword)).first()

    # Check if email already in database
    if not validate_userpassword:
        flask.flash("The Current Password is invalid. Try something else!")
        return flask.redirect(flask.url_for("changepassword"))

    # Check if password and confirm does not matched
    if newpassword != newpassword_confirm:
        flask.flash(
            "Your New Password did not match your Confirmed Password. Try again!")
        return flask.redirect(flask.url_for("changepassword"))

    # Pass all conditions, add info to database with encrypted password
    else:
        encrypt_newpassword = encodepassword(newpassword)
        current_user.password = str(encrypt_newpassword)
        db.session.commit()
        flask.flash("Password updated successfully!")

        return flask.redirect(flask.url_for("profile"))


@app.route('/')
def main():
    return flask.redirect(flask.url_for('login'))


def getDataFromHeaders(headers):
    """
    Looks at the current view's header list to determine which
    view the user is currently seeing so that it returns the appropriate 
    data dictionary of habits
    - Will update this once I use view state on client side
     """

    data_dict = {}

    if len(headers) == 30:
        data_dict = {"habits": getPastMonthAndHabits(), 
                        "messages": getHabitMessages(),
                    }
    else:
        if "M" in headers:
            data_dict = {"habits": getCalendarWeekAndHabits(), 
                            "messages": getHabitMessages(),
            }
        else:
            data_dict = {"habits": getPastWeekAndHabits(),
                            "messages": getHabitMessages(),
                        }
    
    return data_dict


def getHabitMessages():
    messages = []
    messages.extend(getBWMonthHabits())
    messages.extend(getBWWeekHabits())
    return messages

if __name__ == "__main__":
    app.run(
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8081)),
        debug=True,
    )
