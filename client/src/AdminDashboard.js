import { useState } from "react";
import { Row, Col, Button, Form, Container, Alert } from "react-bootstrap";
import ModalQuestion from "./ModalQuestion";
import SurveysList from "./SurveysList";
import QuestionList from "./QuestionList";

function AdminDashboard(props) {

    const [createSurvey, setCreateSurvey] = useState(false);
    const [seeResult, setSeeResult] = useState(false);
    const [modalType, setModalType] = useState("");
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");

    const handleOpenCreate = () => {
        setSeeResult(false);
        setCreateSurvey(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setSeeResult(false);
        
        console.log(questions)
        if(questions.length===0){
            //There aren't questions in the survey
            setError("You cannot publish an empty survey!");
        }else{
            setError("");
            setCreateSurvey(false);
            console.log("Sondaggio " + title + " creato");
            console.log(questions);
            setTitle("");
            setQuestions([]);
        }
        
    }

    const handleClosedQuestion = () => {
        setModalType("closed");
        setShow(true);
    }

    const handleOpenQuestion = () => {
        setModalType("open");
        setShow(true);
    }

    return (
        <>
            <Row className="min-vh-100">
                <Col className="bg-light" sm={4}>
                    <Button className="mt-3" variant="secondary" onClick={handleOpenCreate}>Create new survey</Button>
                    <hr />
                    <SurveysList admin={props.admin} adminSurveys={props.adminSurveys}
                        setAdminSurveys={props.setAdminSurveys}
                        setSeeResult={setSeeResult} setCreateSurvey={setCreateSurvey}>
                    </SurveysList>
                </Col>
                <Col sm={8}>
                    {seeResult ? <>GUARDO RISULTATI</> : <></>}
                    {createSurvey ?
                        <Container>
                            <Row className="justify-content-center">
                                <Col className="mt-2">
                                    {error!=="" ? <Alert variant="danger">{error}</Alert> : <></>}
                                    <Form onSubmit={handleSubmit}>
                                        <Row className="justify-content-center">
                                        <Button className="mr-4" variant="success" type="onSubmit">
                                            Publish survey
                                        </Button>
                                        <Button className="ml-4 mr-4" variant="info" onClick={()=>handleClosedQuestion()}>
                                            Add a new closed question
                                        </Button>
                                        <Button className="ml-4" variant="info" onClick={()=>handleOpenQuestion()}>
                                            Add a new open question
                                        </Button>
                                        </Row>
                                        <hr />
                                        <Form.Label className="mt-2"><h3>Title of your new survey</h3></Form.Label>
                                        <Form.Control required value={title} placeholder="Insert here the title..." type="text" onChange={(event) => setTitle(event.target.value)}/>
                                    </Form>
                                    <hr/>
                                    <QuestionList questions={questions} setQuestions={setQuestions}></QuestionList>
                                </Col>
                            </Row>
                            <ModalQuestion modalType={modalType} setModalType={setModalType} 
                                        show={show} setShow={setShow} 
                                        questions={questions} setQuestions={setQuestions}>
                            </ModalQuestion>
                        </Container>
                        : <></>}
                </Col>
            </Row>
        </>
    );
}

export default AdminDashboard;