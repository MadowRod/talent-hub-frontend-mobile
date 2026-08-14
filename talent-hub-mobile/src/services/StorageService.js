import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@talent-hub/token";
const ROLE_KEY = "@talent-hub/role";
const REMEMBER_KEY = "@talent-hub/remember";

export async function salvarAutenticacao(token, role) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(ROLE_KEY, role);
}

export async function salvarPreferenciaLembrar(valor) {
    await AsyncStorage.setItem(
        REMEMBER_KEY,
        String(valor)
    );
}

export async function obterPreferenciaLembrar() {
    const valor = await AsyncStorage.getItem(REMEMBER_KEY);

    return valor === "true";
}

export async function obterToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function obterRole() {
    return await AsyncStorage.getItem(ROLE_KEY);
}

export async function limparAutenticacao() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(ROLE_KEY);
    await AsyncStorage.removeItem(REMEMBER_KEY);
}