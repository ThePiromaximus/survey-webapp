import SurveyPreview from "./SurveyPreview";
import { Container } from "react-bootstrap";

function SurveysList(props) {

    function renderSurveys() {
        if (!props.admin.username) {
            return props.allSurveys.map((survey) => (
                <SurveyPreview
                    title={survey.title}
                    id={survey.id}
                    author={survey.author}
                ></SurveyPreview>));
        }else{
            return props.adminSurveys.map((survey) => (
                <SurveyPreview
                    title={survey.title}
                    id={survey.id}
                    admin={props.admin}
                ></SurveyPreview>));
        }

    }
    return (
        <Container>
            {renderSurveys()}
        </Container>
    );
}


export default SurveysList;