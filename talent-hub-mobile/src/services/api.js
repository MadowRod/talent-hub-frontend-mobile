import axios from "axios";
import { obterToken } from "./StorageService";

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

api.interceptors.request.use(
    async (config) => {

        const token = await obterToken();

        console.log("TOKEN ENVIADO PARA API:", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;