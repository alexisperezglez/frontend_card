import axios from "axios";

// const baseUrl = 'NGINX_REPLACE_BASE_ENDPOINT'
const baseUrl = 'http://localhost:8080/api/rest/v1/cards';
const config = {
    headers: {
        'Content-Type': 'application/json',
    }
}

const getAllCards = () => {
    return axios.get(baseUrl, config);
}

const getCardById = (id) => {
    return axios.get(`${baseUrl}/${id}`);
}

const saveCard = (card) => {
    return axios.post(baseUrl, card, config);
}

const updateCard = (card) => {
    return axios.put(baseUrl, card);
}

const deleteCard = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

export default {
    getAllCards,
    getCardById,
    saveCard,
    updateCard,
    deleteCard,
};