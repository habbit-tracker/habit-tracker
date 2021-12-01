import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { HabitTable } from './HabitTable.js';


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
  // const [habits, setHabits] = useState(args.habits);
  // const [dayHeaders, setDayHeaders] = useState(args.day_headers)
  const [habitsAndHeaders, setHH] = useState([args.habits, args.day_headers])
  let habits = habitsAndHeaders[0];
  let headers = habitsAndHeaders[1];
  //console.log(habits);

  let titleInput = useRef(null);
  let categoryInput = useRef(null);
  let checkBoxIds = ["monCB", "tuesCB", "wedCB", "thursCB", "friCB", "satCB", "sunCB"];

  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  const [view, setView] = useState();

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
      <FormModal show={modalShow} onClose={handleModalClose} onCreate={onCreateClick}
        titleInput={titleInput} categoryInput={categoryInput} checkBoxIds={checkBoxIds} />

      <ViewsMenuBar onViewClick={handleViewChange} />
      <br /><br />

      <HabitTable habits={habits} columnHeaders={headers} onSquareClick={handleSquareClick} />
      <AddHabit onClick={handleModalShow} />
      <br /> <br /> <br />
      <a href="/logout"><Button variant="outline-success" id="logout">Log Out!</Button></a>

    </>
  );

}
export default App;
