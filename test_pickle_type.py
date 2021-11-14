from app import db
from datetime import date
import pickle


class PickleTest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    string_array = db.Column(db.PickleType)
    dictionary = db.Column(db.PickleType)
    test_dates = db.Column(db.PickleType)

def insertTest():
    test_string_array = ['this', 'is', 'another', 'test', 'string'] 
    test_dict = {'item': 'test dictionary'}
    test_dates = []
    for i in range(0,5):
        test_dates.append(date.today())


    test_row = PickleTest(
        string_array = pickle.dumps(test_string_array),
        dictionary =pickle.dumps(test_dict),
        test_dates = pickle.dumps(test_dates),
    )

    db.session.add(test_row)
    db.session.commit()

def getPickleTest():
        test_objects = PickleTest.query.all() 
        for object in test_objects:
            retrieved_test_object = pickle.loads(object.string_array)
            print(retrieved_test_object)



db.create_all()