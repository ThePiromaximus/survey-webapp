import { Container, Button, Row, Col, Form } from "react-bootstrap";
import React from "react";

function Results(props){

    

    function renderSubmission() {
        //question = {id, type, text, min, max, options, selectedOptions}
        let questionList = props.submission.map((question, index) => {
            if(question.type === 1 || question.type === 2){
                return (
                    <Form key={index}>
                        <Form.Label>
                            {question.text}
                        </Form.Label>
                        <Form.Control readOnly placeholder={question.answer}></Form.Control>
                        <hr/>
                    </Form>
                );
            }else if(question.type === 0){
                const check = (option) => {
                    if(question.selectedOptions.includes(option)){
                        return true;
                    }else{
                        return false;
                    }
                }
                return (
                    <Form key={index}>
                        <Form.Label>
                            {question.text}
                        </Form.Label>
                        {question.options.map((option, indexCB) => {
                            return <Form.Check disabled type="checkbox" label={option} checked={check(option)} key={indexCB}>
                            </Form.Check>
                        })}
                        <hr/>
                    </Form>
                );
            }else{
                return <React.Fragment key={index}/>;
            }
        });

        return questionList;
    };


    const switchUser = async (direction) => {
        if(direction==="prev"){
                props.setCurrentUser((user) => {
                    const index = props.userHasSubmitted.indexOf(user);
                    if(index!==0){
                        //Actual user is not the first
                        props.setUpdateSub((old) => (old + 1));
                        return props.userHasSubmitted[index-1];
                    }else{
                        return props.userHasSubmitted[index];
                    }
                });
                
        }else{
            props.setCurrentUser((user) => {
                const index = props.userHasSubmitted.indexOf(user);
                if(index!==(props.userHasSubmitted.length-1)){
                    //Actual user is not the first
                    props.setUpdateSub((old) => (old + 1));
                    return props.userHasSubmitted[index+1];
                }else{
                    return props.userHasSubmitted[index];
                }
            });
            
        }
    }

    



    return (
        <Container className="mt-3">
            <Row className="align-items-center">
                <Col>
                    <Button variant="success" onClick={()=>switchUser("prev")}>
                        Previous
                    </Button>
                </Col>
                <Col>
                    <h6>This form was submitted by: </h6> {props.currentUser.name}
                </Col>
                <Col>
                    <Button variant="success" onClick={()=>switchUser("foll")}>
                        Following
                    </Button>
                </Col>
            </Row>
            <hr/>
            <Col>
                {renderSubmission()}
            </Col>
        </Container>
    );
}

export default Results;