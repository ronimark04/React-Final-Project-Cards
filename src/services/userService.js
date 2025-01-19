import axios from "axios";


const api = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users";

export function login(loginData) {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": loginData.email,
        "password": loginData.password
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch(`${api}/login`, requestOptions);

}

export function register(registerData) {
    return axios.post(api, registerData);
}

export function getUserById(userId) {
    const headers = {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem('token')
    };

    return axios.get(`${api}/${userId}`, { headers });
}

export function updateUser(userId, userData) {
    const headers = {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem('token')
    };

    return axios.put(`${api}/${userId}`, userData, { headers });
}