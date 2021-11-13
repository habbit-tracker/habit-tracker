import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';

function HabitLabel(props) {
    return (
        <td className="habit-label">{props.habitTitle}</td>
    );
}

function HabitSquare(props) {
    return (
        <td className="habit-square"></td>
    );
}

function HabitRow(props) {
    const squares = [];
    for (let i = 0; i < props.numOfDays; i++) {
        squares.push(<HabitSquare />);
    }
    return (
        <tr>
            <HabitLabel habitTitle={props.habit['habit_title']} />
            {squares}
        </tr>
    );
}

export function HabitTable(props) {
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
                    <HabitRow habit={habit} numOfDays={7} />
                ))}
            </tbody>
        </Table>
    );
}