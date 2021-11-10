import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { useState, useRef } from 'react';

function AddHabit() {
  return (
    <Button variant="outline-success">Add Habit</Button>
  );
}

function App() {

  const args = JSON.parse(document.getElementById("data").text);

  return (
    <AddHabit />
  );
}

export default App;
