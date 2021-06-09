import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './NavigationBar';
import SurveysList from './SurveyPreview.js';
import { Container } from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <NavigationBar></NavigationBar>
      <Container fluid className="min-vh-100">
        <SurveysList></SurveysList>
      </Container>
    </div>
  );
}

export default App;
