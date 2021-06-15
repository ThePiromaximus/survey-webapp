import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

function ModalQuestion(props) {

    const [isMandatory, setIsMandatory] = useState(false);
    const [textOfQuestion, setTextOfQuestion] = useState("");
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [options, setOptions] = useState([]);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [tempOption, setTempOption] = useState("");

    useEffect(()=>{
        setMax(0);
        setMin(0);        
    }, [showOptionModal])

    //Used to check if an open question is mandatory or not
    const handleCheck = (event) => {
        if (event.target.checked) {
            setIsMandatory(true);
        } else {
            setIsMandatory(false);
        }
    }

    //Used to insert a new open question in props.questions
    const handleSubmitOpen = (event) => {
        event.preventDefault();
        let question;
        if (isMandatory) {
            question = {
                text: textOfQuestion,
                type: 1
            }
        } else {
            question = {
                text: textOfQuestion,
                type: 2
            }
        }
        props.setQuestions(() => {
            let temp = props.questions.map((e) => (e));
            temp.push(question);
            return temp;
        })
        setIsMandatory(false);
        setTextOfQuestion("");
        props.setShow(false);
    }

    //Used to insert a new closed question (and its options) in props.questions
    const handleSubmitClosed = (event) => {
        event.preventDefault();
        props.setQuestions(() => {
            let temp = props.questions.map(e => e);
            temp.push({
                text: textOfQuestion,
                type: 0,
                options: options,
                max: +max,
                min: +min
            });
            return temp;
        });
        setTextOfQuestion("");
        setTempOption("");
        setOptions([]);
        setMin(0);
        setMax(0);
        props.setShow(false);
    }

    //Used to close the two modals (open questions and closed questions)
    const handleClose = () => {
        setIsMandatory(false);
        setTextOfQuestion("");
        setOptions([]);
        props.setShow(false);
    }

    //Used to insert the options of a closes question in the state option
    const handleSubmitOption = (event) => {
        event.preventDefault();
        setOptions(() => {
            let temp = options.map(e => e);
            temp.push(tempOption);
            return temp;
        });
        setTempOption("");
        setShowOptionModal(false);
    }

    if (props.modalType === "closed") {
        return (
            <>
                <Modal show={props.show} backdrop="static">
                    <Form onSubmit={handleSubmitClosed}>
                        <Modal.Header>
                            <Modal.Title>New closed question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Form.Label>Text of the question</Form.Label>
                            <Form.Control required value={textOfQuestion} type="text" as="textarea" rows={3} placeholder="Insert here the test of your question.." onChange={(event) => setTextOfQuestion(event.target.value)}></Form.Control>
                            <hr />
                            <Form.Label>
                                Write the answers for your closed question
                                <Form.Text>You can insert a maximum of 10 answers and a minimum of 1</Form.Text>
                            </Form.Label>
                            {options.map((option) => (<h6>{option}</h6>))}
                            <Row>
                                <Col>
                                    <Button className="mr-1" variant="success" onClick={() => setShowOptionModal(true)}>
                                        Add answer
                                    </Button>
                                </Col>
                            </Row>
                            <hr/>
                            <Form.Label>Select max. number of selectable  answers for this question</Form.Label>
                            <Form.Control type="number" defaultValue="0" max={options.length} min={min} onChange={(event) => setMax(event.target.value)}></Form.Control>
                            <Form.Label>Select min. number of selectable answers for this question</Form.Label>
                            <Form.Control type="number" defaultValue="0" max={max} min="0" onChange={(event) => setMin(event.target.value)}></Form.Control>
                            <Form.Text>Notice that you cannot modify max and min attributes if you dont create at least one answer. Also, you cannot choose a max number of answers greater than the number of options or smaller than the min attribute </Form.Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="onSubmit">
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {showOptionModal ?
                    <Modal show={showOptionModal} backdrop="static">
                        <Form onSubmit={handleSubmitOption}>
                            <Modal.Header>
                                <Modal.Title>
                                    Insert a new option
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                                <Form.Label>Text of the option</Form.Label>
                                <Form.Control required value={tempOption} type="text" placeholder="Insert here your option.." onChange={(event) => setTempOption(event.target.value)}></Form.Control>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => {
                                    setTempOption("");
                                    setShowOptionModal(false);
                                }}>
                                    Close
                                </Button>
                                <Button variant="primary" type="onSubmit">
                                    Add option
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal> : <></>}
            </>
        );
    } else if (props.modalType === "open") {
        return (
            <Modal show={props.show} backdrop="static">
                <Form onSubmit={handleSubmitOpen}>
                    <Modal.Header>
                        <Modal.Title>New open question</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <Form.Label>Text of the question</Form.Label>
                        <Form.Control required value={textOfQuestion} type="text" as="textarea" rows={3} placeholder="Insert here the test of your question.." onChange={(event) => setTextOfQuestion(event.target.value)}></Form.Control>
                        <Form.Check type="checkbox" label="Check this box if the question is mandatory" onClick={(event) => handleCheck(event)}></Form.Check>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="onSubmit">
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    } else {
        return <></>;
    }

}

export default ModalQuestion;