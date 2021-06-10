import { Card, Col, Row, Button } from "react-bootstrap";
import { useState } from "react";
import ModalSurvey from "./ModalSurvey";
import API from "./API";

function SurveyPreview(props) {
    const [show, setShow] = useState(false);
    const [surveyTitle, setSurveyTitle] = useState("");

    //I use this function to get the clicked survey through the APIs
    const handleOpenSurvey = async (surveyId, title) => {
        //The API.getSurvey get all the questions of the survey
        const surveyQuestions = await API.getSurvey(surveyId);
        console.log(surveyQuestions); 
        setSurveyTitle(title);
        setShow(true);
    }

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
                surveyTitle={surveyTitle}>
            </ModalSurvey>
        </>

    );
}

export default SurveyPreview;