import { Formik } from "formik";
import { Modal, Button, Col, Row, Form, Alert } from "react-bootstrap";
import { useState } from "react";

function ModalLogin(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        if (username === '') {
            setError("Username field is empty");
        }
        else if (password === '') {
            setError("Password field is empty");
        }
        else {
            setUsername("");
            setPassword("");
            setError("")
            props.setShowLogin(false);
        }
    };

    const handleClose = () => {
        setUsername("");
        setPassword("");
        props.setShowLogin(false);
    }


    if (props.showLogin) {
        return <>
            <Modal show={props.showLogin} onHide={handleLogin} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Login now!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Row className="justify-content-center">
                        <Col lg={6} md={6} sm={8}>
                            <Formik initialValues={{

                            }}>
                                <Form onSubmit={(values) => handleLogin(values)}>
                                    <Form.Group>
                                        {
                                            error!="" ? 
                                            (<Row className="justify-content-center">
                                                <Alert variant="danger">
                                                    {error}
                                                </Alert>
                                            </Row>) : <></>
                                        }
                                        
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            type="text"
                                            placeholder="Your username"
                                            value={username}
                                            onChange={(event) =>
                                                setUsername(event.target.value)
                                            }
                                        />
                                        <Form.Text className="text-muted">
                                            Remember: username are case sensitive!
                                        </Form.Text>
                                        <hr />
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            type="password"
                                            placeholder="Your password"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            } />
                                    </Form.Group>
                                    <hr />
                                    <Button className="m-1" variant="primary" type="onSubmit">
                                        Login
                                    </Button>
                                    <Button className="m-1" variant="secondary" onClick={() => handleClose()}>
                                        Close
                                    </Button>
                                </Form>
                            </Formik>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    }
    else {
        return <></>
    }



}

export default ModalLogin;