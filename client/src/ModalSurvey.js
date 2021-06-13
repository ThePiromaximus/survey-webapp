import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import OpenQuestion from "./OpenQuestion";
import './modalCss.css';
import ClosedQuestion from "./ClosedQuestion";

function ModalSurvey(props) {

    //name of the user who submits the survey
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [wrongQuestion, setWrongQuestion] = useState(0);
    //answer = {answerText (if any), questionId, optionId (if any), userId}
    const [answers, setAnswers] = useState([]); 
   

    const handleClose = () => {
        setError("");
        setName("");
        props.setShow(false)
    };

    //This function handle the submit of a survey
    const handleSubmit = (event) => {
        event.preventDefault();
        let re = "^\\s+$";
        if (name === '' || name.match(re)) {
            setError("You have to insert your name before submit the survey!");
        } else if(wrongQuestion!==0){
            let wq = '';
            props.questions.forEach(element => {
                if(element.questionId===wrongQuestion)
                    	wq = element.questionText;
            });
            setError("It looks like you selected the wrong number of answers in the question: " + wq );
        }
        else {
            alert(name + ", thanks for the submission!");
            console.log("Here your answers:")
            console.log(answers);
            /*
                TODO:
                1) Save the name of the user in the db and return the ID of the tuple created with db.run (PUSH api)
                2) Add in every object of the array answers the id of the user inserted in the db
                3) Save the answers in the db (PUSH api)
            */
            handleClose();
        }
        

    }




    /*
    This function get all the questions of the specific survey and then it creates 
    the form component to manage them
    */
    function renderQuestions() {
        //questions = {max, min, optionId, optionText, questionId, questionText, type}
        let alreadyDid = [];
        let questionList = props.questions.map((question) => {
            if (question.type === 1 || question.type === 2) {
                //Question type = 1 -> Open question, mandatory answer
                //Question type = 2 -> Open question, not mandatory answer
                return <OpenQuestion question={question} setAnswers={setAnswers} answers={answers}></OpenQuestion>;
            }
            else if (question.type === 0 && !alreadyDid.includes(question.id)) {
                //Question type = 0 -> Multiple questions
                alreadyDid.push(question.id);
                let newarray = props.questions.map((e) => (e)).filter(e => e.questionId === question.questionId);
                return (<ClosedQuestion options={newarray} question={question} 
                                        setError={setError} setWrongQuestion={setWrongQuestion}
                                        setAnswers={setAnswers} answers={answers}
                        >
                </ClosedQuestion>);
            }else{
                return <></>;
            }

        });

        return questionList;
    }


    if (props.show) {
        return (
            <>
                <Modal
                    show={props.show}
                    onHide={handleClose}
                    backdrop="static"
                    dialogClassName="my-modal"
                    centered="true"
                    className="justify-content-center"
                >
                    <Modal.Header className="justify-content-center">
                        <Modal.Title >{props.surveyTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <Row className="justify-content-center">
                            <Col >
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group>
                                        <Form.Control size="sm" type="text" placeholder="Insert here your name" value={name} onChange={(event) => setName(event.target.value)} />
                                        {renderQuestions()}
                                    </Form.Group>
                                    <hr />
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="onSubmit">
                                        Submit
                                    </Button>
                                    {
                                        error !== "" ?
                                            (<Row className="justify-content-center mt-1">
                                                <Alert variant="danger">
                                                    {error}
                                                </Alert>
                                            </Row>) : <></>
                                    }
                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        );
    } else {
        return <></>
    }

}

export default ModalSurvey;