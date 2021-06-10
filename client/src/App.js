import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './NavigationBar';
import SurveysList from './SurveyPreview.js';
import { Container } from "react-bootstrap";
import { useState } from "react";
import API from "./API";

function App() {

  //const [dirty, setDirty] = useState(false);
  //admin = {id, username}
  const [admin, setAdmin] = useState({}); //{} means no admin is logged

  return (
    <div className="App">
      <NavigationBar
        admin={admin}
        setAdmin={setAdmin}
      ></NavigationBar>
      <Container fluid className="min-vh-100">
        <SurveysList></SurveysList>
      </Container>
    </div>
  );
}

export default App;
