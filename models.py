from app import db
from flask_login import UserMixin


class UserCredential(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))


class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer)
    title = db.Column(db.String(100))
    category = db.Column(db.String(100), nullable=True)
    date_created = db.Column(db.Date)
    active = db.Column(db.Boolean, default=True)
    target_days = db.Column(db.Integer)
    dates_completed = db.Column(db.PickleType)


class UserInformation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(50), default='None')
    user = db.Column(db.Integer, default='None')
    username = db.Column(db.String(50), default='None')
    phone_number = db.Column(db.String(14), default='None')
    title = db.Column(db.String(50), default='None')
    location = db.Column(db.String(50), default='None')
db.create_all()
