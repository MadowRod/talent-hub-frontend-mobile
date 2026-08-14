import api from "./api";

export async function listarMinhasSkills() {

    const response = await api.get("/usuario/skills");

    return response.data;
}

export async function adicionarSkill(
    skillId,
    level
) {

    const response = await api.post(
        "/usuario/skills",
        {
            skillId: skillId,
            level: level,
        }
    );

    return response.data;
}

export async function atualizarLevel(
    associacaoId,
    level
) {

    const response = await api.put(
        `/usuario/skills/${associacaoId}`,
        {
            level: level,
        }
    );

    return response.data;
}

export async function excluirSkill(
    associacaoId
) {

    console.log(
        "UsuarioSkillService - EXCLUINDO ASSOCIAÇÃO:",
        associacaoId
    );

    const response = await api.delete(
        `/usuario/skills/${associacaoId}`
    );

    console.log(
        "UsuarioSkillService - EXCLUSÃO REALIZADA:",
        response.status
    );

    return response.data;
}