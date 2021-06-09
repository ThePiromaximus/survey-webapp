import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './NavigationBar';
import SurveysList from './LeftBar.js';
import { Container, Col, Row } from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <NavigationBar></NavigationBar>
      <Container fluid className="min-vh-100">
        <Row>
          <Col md={3} className="p-3 bg-light" id="LeftBar">
            <SurveysList></SurveysList>
          </Col>
          <Col md={9} className="min-vh-100">
            Survey Form here
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
