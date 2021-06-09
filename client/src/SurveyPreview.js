import { Card, Col, Row, Button } from "react-bootstrap";
import { useState } from "react";
import ModalSurvey from "./ModalSurvey";

function SurveyPreview() {
    const [show, setShow] = useState(false);
    
    return (

        <>
            <Col>
                <Card bg="light" className="m-2 p-1">
                    <Card.Body >
                        <Row className="align-items-center justify-content-between">
                            <Card.Title className="m-0">Survey 1</Card.Title>
                            <Card.Text className="m-0 ">
                                Made by: Admin1
                            </Card.Text>
                            <Button variant="primary" onClick={()=>setShow(true)}>Fill out</Button>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <ModalSurvey show={show} setShow={setShow}></ModalSurvey>
        </>

    );
}

export default SurveyPreview;