import api from "./api";

export async function cadastrar(nome, email, senha) {

    const response = await api.post(
        "/auth/register",
        {
            nome: nome,
            email: email,
            senha: senha,
        }
    );

    return response.data;
}