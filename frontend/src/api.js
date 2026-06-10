import axios from 'axios';

// Backend cha base URL set karne
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request patvanya aadhi pratyek velees fresh token localStorage madhun uchalne
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        // Headers object exist karto ka he सुनिश्चित karne ani token inject karne
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;