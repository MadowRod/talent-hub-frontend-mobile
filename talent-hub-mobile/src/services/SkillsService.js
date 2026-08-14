import api from "./api";

export async function listarSkills() {
    const response = await api.get("/skills");

    return response.data;
}