from app import db
from flask_login import UserMixin

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))

    
class Habit(db.Model):
    id = db.Column(db.Integer, primary_key =True)
    user = db.Column(db.Integer)
    title = db.Column(db.String(100))
    category = db.Column(db.String(100), nullable=True)
    date_created = db.Column(db.Date)
    active = db.Column(db.Boolean, default=True)
    # TODO:add frequency column

db.create_all()