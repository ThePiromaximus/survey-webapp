import { useState, useEffect } from "react";
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

        if (event.target.checked) {
            //User clicked a checkbox
            //The checked boxes that has been clicked need to be saved
            setCheckedBoxes(checkedBoxes => checkedBoxes + 1);
            props.setAnswers(() => {
                let tempArray = props.answers.map((e) => (e)).filter((e) => (e.optionId !== optionId));
                tempArray.push(tempAnswer);
                return tempArray;
            });
        } else {
            //User un-clicked a checkbox
            //The checked boxes that has been un-clicked need to be removed from the checkedBoxes state
            props.setAnswers(() => {
                //Remove the answer that was unclicked by filtering on optionId
                let tempArray = props.answers.map((e) => (e)).filter((e) => (e.optionId !== optionId));
                return tempArray;
            });
            setCheckedBoxes(checkedBoxes => checkedBoxes - 1);
        }

    }

    //This function get all the options for a multiple questions
    function renderMultiple(array) {
        const multiple = array.map((option, index) => (
            <Form.Check key={index} type="checkbox" label={option.optionText} onClick={(event) => handleClick(event, option.optionId)}></Form.Check>
        ));
        return (<Form.Group>
            {multiple}
        </Form.Group>);
    }

    //Needed to validate checkboxes
    //When checkedBoxes, min, max or props (options in particular) change, then I check if the user has selected the correct amount of options
    useEffect(()=>{
        if(checkedBoxes<min || checkedBoxes>max){
            props.setWrongQuestion(props.question.questionId);
         }else{
             props.setWrongQuestion(0);
         }
    }, [checkedBoxes, min, max, props])


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