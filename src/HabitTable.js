import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';

function HabitLabel(props) {
    return (
        <td>{props.habitTitle}</td>
    );
}

function HabitRow(props) {
    return (
        <tr>
            <th><HabitLabel habitTitle={props.habit['habit_title']} /></th>
        </tr>
    );
}

export function HabitTable(props) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Habit</th>
                </tr>
            </thead>
            <tbody>
                {props.habits.map((habit) => (
                    <HabitRow habit={habit} />
                ))}
            </tbody>
        </Table>
    );
}