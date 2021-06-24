import { useState, useEffect } from "react";
import { Row, Col, Button, Form, Container, Alert } from "react-bootstrap";
import ModalQuestion from "./ModalQuestion";
import SurveysList from "./SurveysList";
import QuestionList from "./QuestionList";
import Results from "./Results";
import API from "./API";

function AdminDashboard(props) {

    const [createSurvey, setCreateSurvey] = useState(false);
    const [seeResult, setSeeResult] = useState(false);
    const [modalType, setModalType] = useState("");
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");
    //Contains the users (name and id) who submitted a specific form (clicked "see answers")
    const [userHasSubmitted, setUserHasSubmitted] = useState([])
    //Contains the id of the current user whose responses I am seeing right now
    const [currentUser, setCurrentUser] = useState(0);
    //Contains the id of the current survey whose response I am seeing right now
    const [currentSurvey, setCurrentSurvey] = useState(0);
    const [submission, setSubmission] = useState([]);
    /*
        I use this state to keep track of update on the current user/survey that the admin is looking.
        Obv I could easy use, as dependencies for the useEffect, both states currentUser and currentSurvey but in
        that way every time I update one of the two states they trigger the useEffect with one value correct and
        one not correct (not updated yet).

        TLDR: is a dirty bit for the update of submission
    */
    const [updateSub, setUpdateSub] = useState(0);

    //UPDATE THE SURVEY THAT IM LOOKING
    useEffect(() => {

        const updateSubmission = async (surveyId, userId) => {
            const questions = await API.getSurvey(surveyId);
            const answers = await API.getSubmission(surveyId, userId);
            let alreadyDid = [];

            let sub = questions.map((question) => {
                //Open question
                if (question.type !== 0) {
                    let answer = answers.filter((answer) => (answer.questionId === question.questionId));
                    if (answer.length !== 0) {
                        return ({
                            id: question.questionId,
                            type: question.type,
                            text: question.questionText,
                            answer: answer[0].answerText
                        });
                    }else{
                        return ({
                            id: question.questionId,
                            type: question.type,
                            text: question.questionText,
                            answer: null
                        });
                    }
                } else {
                    //Closed question
                    if (!alreadyDid.includes(question.questionId)) {
                        alreadyDid.push(question.questionId);
                        //All the options of the question
                        let options = questions.filter((q) => (q.questionId === question.questionId)).map((q) => q.optionText);
                        //IDs of selected options
                        let selectedId = answers.filter((q) => (q.questionId === question.questionId)).map((q) => q.optionId);
                        //Text of the selected options
                        let selectedOptions = questions.map((q) => {
                            if(selectedId.includes(q.optionId)){
                                return q.optionText;
                            }else{
                                return -1;
                            }
                        });
                        return ({
                            id: question.questionId,
                            type: question.type,
                            text: question.questionText,
                            min: question.minAns,
                            max: question.maxAns,
                            options: options,
                            selectedOptions: selectedOptions
                        });
                    }else{
                        //No question is found
                        return -1;
                    }

                }
            });
            setSubmission(sub);
        }

        //I update the submission state only if the user clicked on a valid survey
        //current survey = 0 only when the admin is in the admin dashboard and no survey is selected (for watching answers)
        if(currentSurvey!==0)
            updateSubmission(currentSurvey, currentUser.id)
    }, [updateSub]);

    const handleOpenCreate = () => {
        setSeeResult(false);
        setCreateSurvey(true);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSeeResult(false);

        if (questions.length === 0) {
            //There aren't questions in the survey
            setError("You cannot publish an empty survey!");
        } else {

            //Creation of the empty survey in the db
            const surveyId = await API.createSurvey(props.admin.id, title);
            //From the previous API i receive the ID of the survey just created
            //I use this id to insert all the questions in the DB
            await API.addQuestions(surveyId, questions);
            setError("");
            setCreateSurvey(false);
            setTitle("");
            setQuestions([]);
            const newSurveys = await API.getAdminSurveys(props.admin.id);
            props.setAdminSurveys(newSurveys);
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
                        setSeeResult={setSeeResult} setCreateSurvey={setCreateSurvey}
                        setUserHasSubmitted={setUserHasSubmitted} setCurrentUser={setCurrentUser}
                        setCurrentSurvey={setCurrentSurvey} userHasSubmitted={userHasSubmitted}
                        currentSurvey={currentSurvey} setSubmission={setSubmission}
                        setUpdateSub={setUpdateSub}
                    >
                    </SurveysList>
                </Col>
                <Col sm={8}>
                    {seeResult ? <Results userHasSubmitted={userHasSubmitted} currentUser={currentUser} setCurrentUser={setCurrentUser}
                        currentSurvey={currentSurvey} submission={submission} setSubmission={setSubmission} setUpdateSub={setUpdateSub}>
                    </Results> : <></>}
                    {createSurvey ?
                        <Container>
                            <Row className="justify-content-center">
                                <Col className="mt-2">
                                    {error !== "" ? <Alert variant="danger">{error}</Alert> : <></>}
                                    <Form onSubmit={handleSubmit}>
                                        <Row className="justify-content-center">
                                            <Button className="mr-4" variant="success" type="onSubmit">
                                                Publish survey
                                            </Button>
                                            <Button className="ml-4 mr-4" variant="info" onClick={() => handleClosedQuestion()}>
                                                Add a new closed question
                                            </Button>
                                            <Button className="ml-4" variant="info" onClick={() => handleOpenQuestion()}>
                                                Add a new open question
                                            </Button>
                                        </Row>
                                        <hr />
                                        <Form.Label className="mt-2"><h3>Title of your new survey</h3></Form.Label>
                                        <Form.Control required value={title} placeholder="Insert here the title..." type="text" onChange={(event) => setTitle(event.target.value)} />
                                    </Form>
                                    <hr />
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