import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';

function HabitLabel(props) {
    return (
        <td className="habit-label" >{props.habitTitle}</td>
    );
}

function HabitSquare(props) {
    const title = props.habitTitle;
    const date = props.dateAndStatus['date'];
    if (props.dateAndStatus['completed'] == true) {
        return (
            <td className="habit-square" onClick={() => props.onSquareClick(title, date, 'removing')}>X</td>
        );
    }
    return (
        <td className="habit-square" onClick={() => props.onSquareClick(title, date, 'adding')}></td>
    );
}

function HabitRow(props) {
    const squares = [];
    for (let i = 0; i < props.numOfDays; i++) {
        squares.push(<HabitSquare habitTitle={props.habit['habit_title']} dateAndStatus={props.habit['dates_completed'][i]} onSquareClick={props.onSquareClick} />);
    }
    return (
        <tr>
            <HabitLabel habitTitle={props.habit['habit_title']} />
            {squares}
        </tr>
    );
}

export function HabitTable(props) {
    console.log("headers length")
    console.log(props.columnHeaders.length);
    let numOfDays = props.columnHeaders.length;


    return (
        <Table striped bordered className="weekly-view">
            <thead>
                <tr>
                    <th>Habit</th>
                    {props.columnHeaders.map((headerText) => (
                        <th>{headerText}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.habits.map((habit) => (
                    <HabitRow habit={habit} numOfDays={numOfDays} onSquareClick={props.onSquareClick} />
                ))}
            </tbody>
        </Table>
    );
}
