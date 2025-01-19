import axios from "axios";

const api = `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards`;

export function getAllCards() {
    return axios.get(api);
};

export function getCardById(id) {
    return axios.get(`${api}/${id}`);
};

export function deleteCard(id, bizNumber) {
    const headers = {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem('token')
    };

    const data = {
        bizNumber: bizNumber
    };

    return axios.delete(`${api}/${id}`, { headers, data });
}

export function updateCard(cardId, cardData) {
    const headers = {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem('token')
    };

    return axios.put(`${api}/${cardId}`, cardData, { headers });
}
export function addCard(cardData) {
    const headers = {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem('token')
    };

    return axios.post(api, cardData, { headers });
}

export function toggleLike(cardId) {
    const headers = {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem('token')
    };
    return axios.patch(`${api}/${cardId}`, {}, { headers });
};
