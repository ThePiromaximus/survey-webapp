import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './NavigationBar';
import SurveysList from './SurveysList';
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import API from "./API";
import AdminDashboard from './AdminDashboard';

function App() {

  //const [dirty, setDirty] = useState(false);
  //admin = {id, username}
  const [admin, setAdmin] = useState({}); //{} means no admin is logged
  const [allSurveys, setAllSurveys] = useState([]); //list of all the surveys in the database
  const [adminSurveys, setAdminSurveys] = useState([]); //list of all surveys of a certain admin

  //Visualize all the tasks (for all the users)
  useEffect(() => {

    const getAllSurveys = async () => {
      const surveys = await API.getAllSurveys();
      setAllSurveys(surveys);
    };

    getAllSurveys();

  }, [allSurveys.length, admin]);
  
  useEffect(() => {

    
    const getAdminSurveys = async () => {
      const surveys = await API.getAdminSurveys(admin.id);
      setAdminSurveys(surveys);
    };

    if(admin.username){
      //Get the survey only when an admin is logged in
      getAdminSurveys();
    }
      
  }, [admin]);


  return (
    <div className="App">
      <NavigationBar
        admin={admin}
        setAdmin={setAdmin}
      ></NavigationBar>
      <Container fluid className="min-vh-100">
        {admin.username ? (<AdminDashboard admin={admin} adminSurveys={adminSurveys} setAdminSurveys={setAdminSurveys}></AdminDashboard>) : (<SurveysList allSurveys={allSurveys} setAllSurveys={setAllSurveys} admin={admin}></SurveysList>)}
      </Container>
    </div>
  );
}

export default App;
