import { Form } from "react-bootstrap";

function OpenQuestion(props) {

    //answer = {answerText (if any), questionId, optionId (if any), userId}
    const handleAnswer = (event) => {
        let tempAnswer = {
            answerText: event.target.value,
            questionId: props.question.questionId,
            optionId: null,
            userId: null
        }
        props.setAnswers( () => {
            let tempArray = props.answers.map((e) => (e)).filter((e) => (e.questionId!==props.question.questionId));
            tempArray.push(tempAnswer);
            return tempArray;
        });
    }

    if (props.question.type === 1) {
        //Question type = 1 -> Open question, mandatory answer
        //Question type = 2 -> Open question, not mandatory answer
        return (<>
            <hr />
            <Form.Label>
                <h6>
                    {props.question.questionText}
                </h6>
            </Form.Label>
            <Form.Control required maxLength={200}
                as="textarea" type="text"
                placeholder="Insert your answer here.."
                rows={3}
                onChange={(event)=>handleAnswer(event)}
            />
            <Form.Text className="text-muted">
                (This question is mandatory)
            </Form.Text>
        </>);
    } else {
        return (<>
            <hr />
            <Form.Label>
                <h6>
                    {props.question.questionText}
                </h6>
            </Form.Label>
            <Form.Control maxLength={200} as="textarea" 
                        type="text" placeholder="Insert your answer here.." 
                        rows={3}  onChange={(event)=>handleAnswer(event)} />
        </>);
    }


}

export default OpenQuestion;