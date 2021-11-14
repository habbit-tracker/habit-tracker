import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';

function HabitLabel(props) {
    return (
        <td className="habit-label" >{props.habitTitle}</td>
    );
}

function HabitSquare(props) {
    if (props.dateAndStatus['completed'] == true) {
        return (
            <td className="habit-square" onClick={() => props.onSquareClick()}>X</td>
        );
    }
    return (
        <td className="habit-square" onClick={() => props.onSquareClick()}></td>
    );
}

function HabitRow(props) {
    const squares = [];
    for (let i = 0; i < props.numOfDays; i++) {
        squares.push(<HabitSquare dateAndStatus={props.habit['dates_completed'][i]} onSquareClick={props.onSquareClick} />);
    }
    return (
        <tr>
            <HabitLabel habitTitle={props.habit['habit_title']} />
            {squares}
        </tr>
    );
}

export function HabitTable(props) {
    console.log(props.habits)

    function handleSquareClick() {
        console.log("square clicked");
    }
    return (
        <Table striped bordered hover className="weekly-view">
            <thead>
                <tr>
                    <th>Habit</th>
                    <th>M</th>
                    <th>T</th>
                    <th>W</th>
                    <th>Th</th>
                    <th>F</th>
                    <th>Sa</th>
                    <th>Su</th>
                </tr>
            </thead>
            <tbody>
                {props.habits.map((habit) => (
                    <HabitRow habit={habit} numOfDays={7} onSquareClick={handleSquareClick} />
                ))}
            </tbody>
        </Table>
    );
}