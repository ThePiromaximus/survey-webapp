import { Card, Col, Row, Button } from "react-bootstrap";
import { useState } from "react";
import ModalSurvey from "./ModalSurvey";
import API from "./API";

function SurveyPreview(props) {
    const [show, setShow] = useState(false);
    const [surveyTitle, setSurveyTitle] = useState("");
    const [questions, setQuestions] = useState([]);


    //I use this function to get the clicked survey through the APIs
    //Used to "fill out" surveys in user-side
    const handleOpenSurvey = async (surveyId, title) => {
        //The API.getSurvey get all the questions of the survey
        const surveyQuestions = await API.getSurvey(surveyId);
        setQuestions(surveyQuestions);
        setSurveyTitle(title);
        setShow(true);
    }

    //I use this function in admin side to see the answers that users gave to a certain survey
    const handleSeeResult = async (surveyId) => {
        //I get the list of all users who submitted the selected survey
        const users = await API.getUsersHasSubmitted(surveyId);
        props.setUserHasSubmitted(users);
        props.setCurrentUser(users[0]);
        props.setCurrentSurvey(surveyId);
        const submission = await API.getSubmission(surveyId, users[0].id);
        props.setSubmission(submission)
        props.setCreateSurvey(false);
        props.setSeeResult(true);
        await props.setUpdateSub((old) => (old + 1));
    }
    
    

    if (!props.admin) {
        return (
            <>
                <Card bg="light" className="m-2 p-1">
                    <Card.Body >
                        <Row className="align-items-center justify-content-between">
                            <Col><Card.Title className="m-0 text-left">{props.title}</Card.Title></Col>
                            <Col>
                                <Card.Text className="m-0 ">
                                    Made by: {props.author}
                                </Card.Text>
                            </Col>
                            <Col className="text-right">
                                <Button variant="primary" onClick={() => handleOpenSurvey(props.id, props.title)}>Fill out</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <ModalSurvey
                    show={show}
                    setShow={setShow}
                    surveyTitle={surveyTitle}
                    questions={questions}
                >
                </ModalSurvey>
            </>
        );
    } else {
        const disable = (n) => {
            if(n===0){
                return true;
            }else{
                return false;
            }
        }
        return (
            <>
                <Card className="m-2 p-1">
                    <Card.Body >
                        <Row className="align-items-center justify-content-between">
                            <Col><Card.Title className="m-0 text-left">{props.title}</Card.Title></Col>
                            <Col className="text-right">
                                <Button variant="primary" disabled={disable(props.submissions)} onClick={() => handleSeeResult(props.id)}>See answers</Button>
                            </Col>
                        </Row>
                        <hr/>
                        <Row className="align-items-center justify-content-between">
                            <Col>
                                The survey was submitted by {props.submissions} people
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </>
        );
    }

}

export default SurveyPreview;