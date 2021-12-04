import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from 'react-bootstrap';

export function HabitCardContainer(props) {
    return (
        <Container fluid>
            <Row>
                {props.messages.map((message) => (
                    <Col className="col-lg-3">
                        <InfoCard infoText={message} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}


function InfoCard(props) {
    var encourageWords = ["Good Job", "You Got This!", "Nice Work!", "Keep Pushing!", "One Habit at a Time!", "One Day at a Time", ":)"];
    var footerText = encourageWords[Math.floor(Math.random() * encourageWords.length)];
    return (
        <Card className="text-center" bg="secondary" text="white" border="black" >
            <Card.Body>
                <Card.Text>{props.infoText}</Card.Text>
                <Card.Footer>
                    <b>  {footerText} </b>
                </Card.Footer>
            </Card.Body>

        </Card>
    );
}

