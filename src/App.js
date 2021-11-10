import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { useState, useRef } from 'react';

function AddHabit() {
  return (
    <Button variant="outline-success">Add Habit</Button>
  );
}

function HabitForm() {
  return (
    <Form className="form-container">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Habit Name</Form.Label>
        <Form.Control placeholder="Habit Name" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Category</Form.Label>
        <Form.Control placeholder="Category(optional)" />
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
      <Button variant="success" type="submit">
        Create Habit
      </Button>
    </Form>
  );

}

function App() {

  const args = JSON.parse(document.getElementById("data").text);
  return (
    <>
      <HabitForm />
    </>
  );
}

export default App;
