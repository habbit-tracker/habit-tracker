import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { useState, useRef } from 'react';

function AddHabit(props) {
  return (
    <Button variant="outline-success">Add Test Habit</Button>
  );
}

function HabitForm(props) {
  const dayLabels = ['Monday', 'Tuedsay', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let labelIdPairs = [];

  //Places daylabels and checkBoxIds into tuple like structure >> stored in labelIdPairs for mapping
  for (let i = 0; i < 7; i++) {
    let currentPair = [dayLabels[i], props.checkBoxIds[i]];
    labelIdPairs.push(currentPair);
  }

  return (
    <Form className="form-container">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Habit Name</Form.Label>
        <Form.Control placeholder="Habit Name" ref={props.titleInput} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Category</Form.Label>
        <Form.Control placeholder="Category(optional)" ref={props.categoryInput} />
      </Form.Group>
      <Form.Label>Target Days</Form.Label>
      <Form.Group>
        {labelIdPairs.map((day) => (
          <Form.Check
            inline
            label={day[0]}
            name="group1"
            type='checkbox'
            defaultChecked='True'
            id={day[1]}
          />
        ))}
      </Form.Group>
      <br />
      <Button variant="success" onClick={() => props.onClick()}>
        Create Habit
      </Button >
    </Form>
  );

}


function App() {
  const args = JSON.parse(document.getElementById("data").text);

  let titleInput = useRef(null);
  let categoryInput = useRef(null);
  let checkBoxIds = ["monCB", "tuesCB", "wedCB", "thursCB", "friCB", "satCB", "sunCB"];

  function onCreateClick() {

    let title = titleInput.current.value;
    let category = categoryInput.current.value;
    let target_days_str = '';

    //Builds target_days_str by checking to see if each checkbox is checked in order from Monday through Sunday.
    for (let i = 0; i < 7; i++) { //7 days in the week
      let checkBox = document.getElementById(checkBoxIds[i]);
      if (checkBox.checked) {
        target_days_str = target_days_str.concat("1");
      } else {
        target_days_str = target_days_str.concat("0");
      }
    }

    //Sends habit information to server in JSON form.
    fetch('/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "title": title,
        "category": category,
        "target_days_str": target_days_str
      }),
    }).then(response => response.json());

    //Clears text fields
    titleInput.current.value = "";
    categoryInput.current.value = "";
  }

  return (
    <>
      <HabitForm onClick={onCreateClick} titleInput={titleInput} categoryInput={categoryInput} checkBoxIds={checkBoxIds} />
    </>
  );

}
export default App;
