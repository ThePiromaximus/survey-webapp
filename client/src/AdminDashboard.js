import { Row, Col, Button } from "react-bootstrap";
import SurveysList from "./SurveysList";
function AdminDashboard(props) {


    return (
        <>
            <Row className="min-vh-100">
                <Col className="bg-light" sm={4}>
                    <Button className="mt-3" variant="secondary">Create new survey</Button>
                    <hr/>
                    <SurveysList admin={props.admin} adminSurveys={props.adminSurveys} setAdminSurveys={props.setAdminSurveys}></SurveysList>
                </Col>
                <Col sm={8}>
                    Zona principale
                </Col>
            </Row>
        </>
    );
}

export default AdminDashboard;