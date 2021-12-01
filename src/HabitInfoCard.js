import 'bootstrap/dist/css/bootstrap.min.css';
import { Stack, InputGroup, FormControl, Container, Row, Col, Card, CardImg } from 'react-bootstrap';

export function CardContainer(props) {
    return (
        <Container>
            <Row className='row-cols-1 row-cols-lg-3'>
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
    var encourageWords = ["Good Job", "You Got This", "Nice Work!", "Keep Pushing", "Habit Master"];
    var randomWords = encourageWords[Math.floor(Math.random() * encourageWords.length)];
    return (
        <Card className="text-center" bg="dark" text="white" style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Text>{props.infoText}</Card.Text>
                <Card.Footer>
                    <small className="text-muted">{randomWords}</small>
                </Card.Footer>
            </Card.Body>

        </Card>
    );
}

