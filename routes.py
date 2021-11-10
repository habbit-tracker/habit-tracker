from app import app, bp, db
from models import User, Habit
import os
import json
import requests
import flask
from flask_login import login_user, current_user, LoginManager
from flask_login.utils import login_required


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

@app.route('/save', methods=["POST"])
def save():
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