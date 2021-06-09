import { Card, Container, Button } from "react-bootstrap";

function SurveyPreview() {
    return (
        <>
            <Card className = "m-1 p-1">
                <Card.Body>
                    <Card.Title>Survey 1</Card.Title>
                    <Card.Text>
                        Made by: Admin1
                    </Card.Text>
                    <Button variant="primary">Fill out</Button>
                </Card.Body>
            </Card>
        </>
    );
}

function SurveysList() {
    return (
        <Container fluid>
            <SurveyPreview></SurveyPreview>
        </Container>
    );
}

export default SurveysList;