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

//API to create a new user and receive its ID as a response
async function createUser(name){
    const url = '/api/user';
    try{
        const res = await axios.post(url,{ name: name});
        return res.data;
    }catch(error) {
            alert("ERROR ON createUser() API");
     };
}

//API to insert answers of a survey in the DB
async function saveAnswers(answers){
    const url = '/api/survey';
    let answerTemp = [];
    for(let i = 0; i < answers.length; i++){
        // answer = {answerText (if any), questionId, optionId (if any), userId}
        let answer = {  
            answerText: answers[i].answerText,
            questionId: +answers[i].questionId,
            optionId: +answers[i].optionId,
            userId: +answers[i].userId
        };

        answerTemp.push(answer);
    }
    
    try{
        
        const res = await axios.post(url, answerTemp);
        return res;
            
    }catch(error){
        alert("ERROR ON saveAnswers() API");
    }
}

//API to get all surveys of a certain admin given its ID
async function getAdminSurveys(id){
    const url = `/api/admin=${id}`;
    try{
        const res = await axios.get(url, {id: id});
        const surveys = await res.data;
        return surveys;
    }catch(error){
        alert("ERROR ON getAdminSurveys() API");
    }
}

//API to create a new (empty) survey and return its ID
async function createSurvey(id, title){
    const url = `/api/admin=${id}/survey`;
    try{
        const res = await axios.post(url, {id: id, title: title});
        return res.data;
    }catch(error){
        alert("ERROR ON createSurvey() API");
    }
}

//API to add questions to a new (empty) survey given its ID
async function addQuestions(id, questions){
    const url = `/api/admin/survey/questions`;
    let questionsTemp = [];
    for(let i = 0; i < questions.length; i++){
        //questions = {text, type, options (if any), max (if any), min(if any)}
        let question;
        if(questions[i].type===0){
            question = {  
                text: questions[i].text,
                type: +questions[i].type,
                options: questions[i].options,
                max: +questions[i].max,
                min: +questions[i].min,
            };
        }else{
            question = {  
                text: questions[i].text,
                type: +questions[i].type,
                options: null,
                max: null,
                min: null,
            };
        }
        
        questionsTemp.push(question);
    }
    
    try{
        const res = await axios.post(url, {id: id, questions: questionsTemp});
        return res.data;
    }catch(error){
        alert("ERROR ON addQuestion() API");
    }
}

const API = { login, logout, getAllSurveys, getSurvey, createUser, saveAnswers, getAdminSurveys, createSurvey, addQuestions }
export default API;