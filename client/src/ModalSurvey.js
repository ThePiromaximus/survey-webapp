import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import './modalCss.css';

function ModalSurvey(props) {

    const handleClose = () => props.setShow(false);

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
                        <Modal.Title >Survey</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <Row className="justify-content-center">
                            <Col lg={6} md={6} sm={8}>
                                <Form.Control size="sm" type="text" placeholder="Remember to insert your name before submit the survey" />
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col>
                                Lorem ipsum
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center" >
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    } else {
        return <></>
    }

}

export default ModalSurvey;