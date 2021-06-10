import SurveyPreview from "./SurveyPreview";
import { Container } from "react-bootstrap";

function SurveysList(props) {

    function renderSurveys() {
        return props.allSurveys.map((survey) => (
            <SurveyPreview
                title={survey.title}
                id={survey.id}
                author={survey.author}
            ></SurveyPreview>));
    }
    return (
        <Container>
            {renderSurveys()}
        </Container>
    );
}


export default SurveysList;