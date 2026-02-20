import axios from 'axios';

const api = axios.create({
    baseUrl: 'http://localhost:3000/api/v1',
    withCredentials: true
});

export default api;