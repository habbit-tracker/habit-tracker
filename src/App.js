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
        <Form.Check
          inline
          label="Monday"
          name="group1"
          type='checkbox'
          defaultChecked='True'
        //id=
        />
        <Form.Check
          inline
          label="Tuesday"
          name="group1"
          type='checkbox'
          defaultChecked='True'
        //id=
        />
        <Form.Check
          inline
          label="Wednesday"
          name="group1"
          type='checkbox'
          defaultChecked='True'
        //id=
        />
        <Form.Check
          inline
          label="Thursday"
          name="group1"
          type='checkbox'
          defaultChecked='True'
        //id=
        />
        <Form.Check
          inline
          label="Friday"
          name="group1"
          type='checkbox'
          defaultChecked='True'
        //id=
        />
        <Form.Check
          inline
          label="Saturday"
          name="group1"
          type='checkbox'
          defaultChecked='True'
        //id=
        />
        <Form.Check
          inline
          label="Sunday"
          name="group1"
          type='checkbox'
          defaultChecked='True'
        //id=
        />
      </Form.Group>
      <Button variant="success" onClick={() => props.onTestClick()}>
        Create Habit
      </Button >
    </Form>
  );

}


function App() {
  const args = JSON.parse(document.getElementById("data").text);

  let titleInput = useRef(null);
  let categoryInput = useRef(null);

  function onTestCreateClick() {

    let title = titleInput.current.value;
    let category = categoryInput.current.value;

    console.log(JSON.stringify({
      "title": title,
      "category": category,
      "target_days": 112 //hardcoded target_days for test purposes
    }));

    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "title": title,
        "category": category,
        "target_days": 112
      }),
    }).then(response => response.json());

    titleInput.current.value = "";
    categoryInput.current.value = "";

  }

  return (
    <>
      <HabitForm onTestClick={onTestCreateClick} titleInput={titleInput} categoryInput={categoryInput} />
    </>
  );
}

export default App;
