import logo from './logo.svg';
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { HabitTable } from './HabitTable.js';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './piechart.js';

function ViewsMenuBar(props) {
  //TODO: create enum rather than string for views
  return (<ListGroup horizontal>
    <ListGroup.Item action variant="info" onClick={() => props.onViewClick('this_week')}>This Week</ListGroup.Item>
    <ListGroup.Item action variant="info" onClick={() => props.onViewClick('past_seven_days')}>Past 7 Days</ListGroup.Item>
    <ListGroup.Item action variant="info" onClick={() => props.onViewClick('past_month')}>Past Month</ListGroup.Item>

  </ListGroup>
  );
}

function AddHabit(props) {
  return (
    <Button variant="outline-success" onClick={props.onClick}>Add Habit</Button>
  );
}

function FormModal(props) {

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={props.onClose}>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a New Habit
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <HabitForm titleInput={props.titleInput} categoryInput={props.categoryInput} checkBoxIds={props.checkBoxIds} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => props.onCreate()}>
          Create Habit
        </Button >
      </Modal.Footer>
    </Modal >
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
    <Form >
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
    </Form>
  );

}


function App() {
  const args = JSON.parse(document.getElementById("data").text);
  let pieChartData = args.pie_chart_data;
  var canvas = document.createElement('canvas');
  ChartJS.register(ArcElement, Tooltip, Legend);
  var data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      label: "Habits Completed Each Day This Week",
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 2,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: pieChartData,
    }]
  };

  var options = {
    maintainAspectRatio: false,
    radius: '200'
  };

  //TODO: implement current_views state to make client server interaction smoother
  const [habitsAndHeaders, setHH] = useState([args.habits, args.day_headers]);
  let habits = habitsAndHeaders[0];
  let headers = habitsAndHeaders[1];

  let titleInput = useRef(null);
  let categoryInput = useRef(null);
  let checkBoxIds = ["monCB", "tuesCB", "wedCB", "thursCB", "friCB", "satCB", "sunCB"];

  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

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
        "target_days_str": target_days_str,
        "current_view_headers": headers,
      }),
    }).then((response) => response.json())
      .then((data) => {
        setHH([data.habits, headers]);
      });

    //Clears text fields and hides modal
    titleInput.current.value = "";
    categoryInput.current.value = "";
    handleModalClose();
  }

  //moved to App.js so that it could access the habit state
  function handleSquareClick(title, date, action) {

    //Sends habit information to server in JSON form.
    fetch('/update-completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "action": action,
        "title": title,
        "date": date,
        "current_view_headers": headers,
      }),
    }).then(response => response.json())
      .then((data) => {
        setHH([data.habits, headers]);
      });
  }

  function handleViewChange(view_str) {

    //Sends over user view type in JSON form.
    fetch('/update-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "view_string": view_str,
      }),
    }).then(response => response.json())
      .then((data) => {
        console.log(data)
        setHH([data.habits, data.day_headers]);
        habits = habitsAndHeaders[0];
        headers = habitsAndHeaders[1];

      });
  }

  

  return (
    <>
      <Router>
        <Navbar />
      </Router>
      <FormModal show={modalShow} onClose={handleModalClose} onCreate={onCreateClick}
        titleInput={titleInput} categoryInput={categoryInput} checkBoxIds={checkBoxIds} />
      <ViewsMenuBar onViewClick={handleViewChange} />
      <br /><br />
      <HabitTable habits={habits} columnHeaders={headers} onSquareClick={handleSquareClick} />
      <AddHabit onClick={handleModalShow} />
      <br />
      <div style={{width:400,height:400,}}>
        <canvas id="habitPie" style={{width:400,height:400,border:'black solid 1px'}}></canvas>
      </div>
      <br />
      <br />
      <a href="/logout"><Button variant="outline-success" id="logout">Log Out!</Button></a>
      <AddHabit onClick={handleModalShow} />
      <HabitTable habits={habits} columnHeaders={headers} onSquareClick={handleSquareClick} />
    </>
  );

}
export default App;
