import { useState } from "react";
import { Form } from "react-bootstrap";
//This variable is used to count how much boxes are checked and if they are between min and max


function ClosedQuestion(props) {
    let min = props.question.min;
    let max = props.question.max;
    const [checkedBoxes, setCheckedBoxes] = useState(0);

    const handleClick = (event) => {  
         
        if(event.target.checked){
            setCheckedBoxes(checkedBoxes => checkedBoxes + 1);
        }else{
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
            <Form.Check type="checkbox" label={option.optionText} onClick={(event) => handleClick(event)}></Form.Check>
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