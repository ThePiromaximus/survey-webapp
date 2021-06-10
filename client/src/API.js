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


const API = { login, logout }
export default API;