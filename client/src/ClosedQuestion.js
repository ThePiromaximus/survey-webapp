import { useState } from "react";
import { Form } from "react-bootstrap";

function ClosedQuestion(props) {
    let min = props.question.min;
    let max = props.question.max;
    const [checkedBoxes, setCheckedBoxes] = useState(0);

    const handleClick = (event, optionId) => {  
        //OptionId: id of the options clicked
        //Passed as second parameter in onClick property of Form.Check
        let tempAnswer = {
            answerText: null,
            questionId: props.question.questionId,
            optionId: optionId,
            userId: null
        }
        
        if(event.target.checked){
            setCheckedBoxes(checkedBoxes => checkedBoxes + 1);
            props.setAnswers( () => {
                let tempArray = props.answers.map((e) => (e)).filter((e) => (e.optionId!==optionId));
                tempArray.push(tempAnswer);
                return tempArray;
            });
        }else{
            props.setAnswers( () => {
                let tempArray = props.answers.map((e) => (e)).filter((e) => (e.optionId!==optionId));
                return tempArray;
            });
            setCheckedBoxes(checkedBoxes => checkedBoxes - 1);
        }

    }

    //This function get all the options for a multiple questions
    function renderMultiple(array) {
        //Needed to validate checkboxes
        if(checkedBoxes<min || checkedBoxes>max){
           props.setWrongQuestion(props.question.questionId);
        }else{
            props.setWrongQuestion(0);
        }
        const multiple = array.map((option) => (
            <Form.Check type="checkbox" label={option.optionText} onClick={(event) => handleClick(event, option.optionId)}></Form.Check>
        ));
        return (<Form.Group>
            {multiple}
        </Form.Group>);
    }

        return (<>
            <hr />
            <Form.Label>
                <h6>
                    {props.options[0].questionText}
                </h6>
            </Form.Label>
            {renderMultiple(props.options)}
            <Form.Text className="text-muted">
                (min answers: {props.question.min} - max answers: {props.question.max})
            </Form.Text>
        </>
        );

}


export default ClosedQuestion;