import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

export async function login(email, senha) {
    const response = await axios.post(
        `${API_URL}/auth/login`,
        {
            email,
            senha,
        }
    );

    return response.data;
}

export async function cadastrar(nome, email, senha) {
    const response = await axios.post(
        `${API_URL}/auth/register`,
        {
            nome,
            email,
            senha,
        }
    );

    return response.data;
}