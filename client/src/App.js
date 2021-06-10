import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './NavigationBar';
import SurveysList from './SurveysList';
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import API from "./API";

function App() {

  //const [dirty, setDirty] = useState(false);
  //admin = {id, username}
  const [admin, setAdmin] = useState({}); //{} means no admin is logged
  const [allSurveys, setAllSurveys] = useState([]); //list of all the surveys in the database

  //Visualize all the tasks (for all the users)
  useEffect(() => {

    const getAllSurveys = async () => {
      const surveys = await API.getAllSurveys();
      setAllSurveys(surveys);
    };

    getAllSurveys();

  }, [allSurveys.length]);
  


  return (
    <div className="App">
      <NavigationBar
        admin={admin}
        setAdmin={setAdmin}
      ></NavigationBar>
      <Container fluid className="min-vh-100">
        <SurveysList allSurveys={allSurveys} setAllSurveys={setAllSurveys}></SurveysList>
      </Container>
    </div>
  );
}

export default App;
