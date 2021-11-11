from app import app, bp, db
from models import User, Habit
import os
import json
import requests
import flask
from flask_login import login_user, current_user, LoginManager
from flask_login.utils import login_required
from datetime import date



@bp.route('/index')
#@login_required
def index():
    # TODO: insert the data fetched by your app main page here as a JSON
    DATA = {"your": "data here"}
    data = json.dumps(DATA)
    return flask.render_template(
        "index.html",
        data=data,
    )

@bp.route('/save', methods=["POST"])
def saveTestHabit():
    response_json = flask.request.json

    #takes binary string ie '1100100' and converts to int
    target_days_str = response_json['target_days_str']
    target_days_bin = bin(int(target_days_str,2))
    target_days_int = int(target_days_bin, 2)

    habit = Habit(
        user = 10, #hardcoded user id for test purposes, will update once login functionality is complete
        title = response_json['title'],
        category = response_json['category'],
        date_created = date.today(),
        target_days = target_days_int,
    )

    db.session.add(habit)
    db.session.commit()

    return flask.jsonify({"status":'success'}) #TODO: update to something more meaningful

app.register_blueprint(bp)

@app.route('/signup')
def signup():
	return flask.render_template("sign-up.html")

@app.route('/signup', methods=["POST"])
def signup_post():
	...

@app.route('/login')
def login():
    return flask.render_template("log-in.html")

@app.route('/login', methods=["POST"])
def login_post():
	...


@app.route('/')
def main():
	#return flask.redirect(flask.url_for('login'))
    return flask.redirect(flask.url_for('bp.index'))



if __name__ == "__main__":
    app.run(
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8081)),
        debug=True,
    )