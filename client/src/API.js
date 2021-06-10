import axios from "axios";

//API to send POST request for the login
async function login(credentials) {

    let response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const admin = await response.json();
        return admin;
    }
    else {
        try {
            const error = await response.json();
            throw error.message;
        }
        catch (err) {
            throw err;
        }
    }
}

//API to send DELETE request for the logout
async function logout() {
    await fetch('/api/logout',
        {
            method: 'DELETE'
        });
}

//API to get ALL the surveys in the database (for all the users)
async function getAllSurveys(){
    try{
        const res = await axios.get('/api/surveys');
        const surveysList = res.data; 
        return surveysList;
    }catch(error){
        alert("ERROR ON getAllSurveys() API");
    }
}

//API to get a specific survey and its questions given its IDs
async function getSurvey(id){
    const url = `/api/survey=${id}`;
    try{
        const res = await axios.get(url, {id: id});
        const survey = await res.data;
        return survey;
    }catch(error){
        alert("ERROR ON getSurvey() API");
    }
}

const API = { login, logout, getAllSurveys, getSurvey }
export default API;