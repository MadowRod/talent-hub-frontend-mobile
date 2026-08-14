import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { login } from "../services/AuthService";
import {
    salvarAutenticacao,
    salvarPreferenciaLembrar,
} from "../services/StorageService";

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

export default function LoginScreen() {

    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrarMe, setLembrarMe] = useState(false);
    const [carregando, setCarregando] = useState(false);

    async function handleLogin() {

        if (!email || !senha) {
            return;
        }

        try {

            setCarregando(true);

            const response = await login(
                email,
                senha
            );

            await salvarAutenticacao(
                response.token,
                response.role
            );

            await salvarPreferenciaLembrar(
                lembrarMe
            );

            console.log("Login realizado!");
            console.log("Token:", response.token);
            console.log("Tipo:", response.tipo);
            console.log("Role:", response.role);
            console.log("Lembrar-me:", lembrarMe);

            navigation.navigate("Home");

        } catch (error) {

            console.error(
                "Erro ao realizar login:",
                error
            );

        } finally {

            setCarregando(false);

        }
    }

    function handleCadastro() {
        navigation.navigate("Cadastro");
    }

    return (
        <View style={styles.container}>

            {/* CABEÇALHO */}

            <View style={styles.header}>

                <View style={styles.logoContainer}>

                    <Text style={styles.logoText}>
                        TH
                    </Text>

                </View>

                <Text style={styles.title}>
                    Talent Hub
                </Text>

                <Text style={styles.welcome}>
                    Bem-vindo de volta!
                </Text>

                <Text style={styles.subtitle}>
                    Entre na sua conta para continuar
                    desenvolvendo seu perfil profissional.
                </Text>

            </View>

            {/* FORMULÁRIO */}

            <View style={styles.form}>

                <Text style={styles.label}>
                    E-mail
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Text style={styles.label}>
                    Senha
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#94A3B8"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                {/* LEMBRAR-ME */}

                <Pressable
                    style={styles.rememberContainer}
                    onPress={() =>
                        setLembrarMe(!lembrarMe)
                    }
                >

                    <View
                        style={[
                            styles.checkbox,
                            lembrarMe &&
                            styles.checkboxChecked,
                        ]}
                    >

                        {lembrarMe && (
                            <Text style={styles.check}>
                                ✓
                            </Text>
                        )}

                    </View>

                    <Text style={styles.rememberText}>
                        Lembrar de mim
                    </Text>

                </Pressable>

                {/* BOTÃO ENTRAR */}

                <Pressable
                    style={[
                        styles.button,
                        carregando &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleLogin}
                    disabled={carregando}
                >

                    {carregando ? (

                        <ActivityIndicator
                            color="#FFFFFF"
                        />

                    ) : (

                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>

                    )}

                </Pressable>

                {/* DIVISOR */}

                <View style={styles.dividerContainer}>

                    <View style={styles.divider} />

                    <Text style={styles.dividerText}>
                        ou
                    </Text>

                    <View style={styles.divider} />

                </View>

                {/* CADASTRO */}

                <View style={styles.registerContainer}>

                    <Text style={styles.registerDescription}>
                        Ainda não possui uma conta?
                    </Text>

                    <Pressable
                        style={styles.registerButton}
                        onPress={handleCadastro}
                    >

                        <Text style={styles.registerButtonText}>
                            Criar uma conta
                        </Text>

                    </Pressable>

                </View>

            </View>

            {/* RODAPÉ */}

            <Text style={styles.footer}>
                Desenvolva suas habilidades.
                Conecte-se ao seu futuro.
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        paddingHorizontal: 24,
        paddingVertical: 30,
        justifyContent: "center",
    },

    header: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        alignItems: "center",
        marginBottom: 28,
    },

    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: 22,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,

        shadowColor: "#2563EB",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },

    logoText: {
        color: "#FFFFFF",
        fontSize: 25,
        fontWeight: "900",
        letterSpacing: 1,
    },

    title: {
        fontSize: 34,
        fontWeight: "900",
        color: "#0F172A",
        marginBottom: 8,
        letterSpacing: -0.5,
    },

    welcome: {
        fontSize: 22,
        fontWeight: "800",
        color: "#2563EB",
        textAlign: "center",
        marginBottom: 8,
    },

    subtitle: {
        width: "100%",
        fontSize: 15,
        lineHeight: 22,
        color: "#475569",
        textAlign: "center",
        paddingHorizontal: 10,
    },

    form: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 22,

        shadowColor: "#0F172A",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },

    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 8,
    },

    input: {
        width: "100%",
        height: 52,
        borderWidth: 1.5,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 15,
        color: "#0F172A",
        backgroundColor: "#F8FAFC",
        marginBottom: 18,
    },

    rememberContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 22,
    },

    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: "#2563EB",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 9,
        backgroundColor: "#FFFFFF",
    },

    checkboxChecked: {
        backgroundColor: "#2563EB",
    },

    check: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "900",
    },

    rememberText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#475569",
    },

    button: {
        width: "100%",
        height: 54,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",

        shadowColor: "#2563EB",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 7,
        elevation: 5,
    },

    buttonDisabled: {
        opacity: 0.7,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.3,
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 22,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E2E8F0",
    },

    dividerText: {
        marginHorizontal: 12,
        fontSize: 13,
        fontWeight: "600",
        color: "#94A3B8",
    },

    registerContainer: {
        alignItems: "center",
    },

    registerDescription: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 8,
    },

    registerButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
    },

    registerButtonText: {
        color: "#2563EB",
        fontSize: 15,
        fontWeight: "800",
    },

    footer: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        textAlign: "center",
        marginTop: 24,
        fontSize: 12,
        lineHeight: 18,
        color: "#94A3B8",
        fontWeight: "500",
    },

});