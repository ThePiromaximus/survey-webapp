import { Card, Button, Col, Row } from "react-bootstrap";

function QuestionList(props) {

    function swap(direction, text) {
        let index = props.questions.map(e => e.text).indexOf(text);
        let tempArray = props.questions.map(e => e);
        if (direction === "up") {
            //Swap up
            if (index > 0) {
                //The question is not the first
                let temp = tempArray[index];
                tempArray[index] = tempArray[index - 1];
                tempArray[index - 1] = temp;
                props.setQuestions(tempArray);
            }

        } else {
            //Swap down
            if (index < (props.questions.length - 1)) {
                //The question is not the last one
                let temp = tempArray[index];
                tempArray[index] = tempArray[index + 1];
                tempArray[index + 1] = temp;
                props.setQuestions(tempArray);
            }
        }
    }

    function deleteQuestion(text) {
        props.setQuestions(() => {
            return props.questions.filter((question) => question.text !== text);
        });
    }


    function renderQuestions() {
        //questions = {text, type, options (if any), max (if any), min(if any)}
        let questionList = props.questions.map((question) => {
            if (question.type === 1) {
                return (
                    <Card className="mt-2">
                        <Card.Body>
                            <Card.Title>
                                {question.text}
                            </Card.Title>
                            <Row className="justify-content-between">
                                <Col>
                                    Mandatory question
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col>
                                    <Button variant="success" onClick={() => swap("up", question.text)}>
                                        Up
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="success" onClick={() => swap("down", question.text)}>
                                        Down
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="danger" onClick={() => deleteQuestion(question.text)}>
                                        Delete question
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>);
            } else if (question.type === 2) {
                return (
                    <Card className="mt-2">
                        <Card.Body>
                            <Card.Title>
                                {question.text}
                            </Card.Title>
                            <hr />
                            <Row>
                                <Col>
                                    <Button variant="success" onClick={() => swap("up", question.text)}>
                                        Up
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="success" onClick={() => swap("down", question.text)}>
                                        Down
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="danger" onClick={() => deleteQuestion(question.text)}>
                                        Delete question
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>);
            } else if (question.type === 0) {
                return (
                    <Card className="mt-2">
                        <Card.Body>
                            <Card.Title>
                                {question.text}
                            </Card.Title>
                            <Card.Text>
                                Min. answers: {question.min} - Max. answers: {question.max}
                            </Card.Text>
                            <hr />
                            <Row className="justify-content-between">
                                <Col>
                                    {question.options.map((option) => <h6>{option}</h6>)}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant="success" onClick={() => swap("up", question.text)}>
                                        Up
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="success" onClick={() => swap("down", question.text)}>
                                        Down
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="danger" onClick={() => deleteQuestion(question.text)}>
                                        Delete question
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>);
            } else {
                return <></>
            }


        });

        return questionList;

    }

    return (
        <>{renderQuestions()}</>
    );


}

export default QuestionList;