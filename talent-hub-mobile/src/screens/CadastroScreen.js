import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { cadastrar } from "../services/AuthService";

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";

export default function CadastroScreen() {

    const navigation = useNavigation();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [carregando, setCarregando] = useState(false);

    async function handleCadastro() {

        if (!nome || !email || !senha || !confirmarSenha) {

            console.log("Preencha todos os campos.");

            return;
        }

        if (senha !== confirmarSenha) {

            console.log("As senhas não coincidem.");

            return;
        }

        if (senha.length < 6) {

            console.log(
                "A senha deve possuir pelo menos 6 caracteres."
            );

            return;
        }

        try {

            setCarregando(true);

            console.log("INICIANDO CADASTRO...");

            console.log("Nome:", nome);
            console.log("Email:", email);

            const response = await cadastrar(
                nome,
                email,
                senha
            );

            console.log(
                "CADASTRO REALIZADO COM SUCESSO:"
            );

            console.log(
                "Resposta da API:",
                response
            );

            console.log(
                "REDIRECIONANDO PARA LOGIN..."
            );

            navigation.replace("Login");

        } catch (error) {

            console.error(
                "ERRO AO REALIZAR CADASTRO:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "RESPOSTA DA API:",
                error.response?.data
            );

            Alert.alert(
                "Erro",
                error.response?.data?.message ||
                "Não foi possível realizar o cadastro."
            );

        } finally {

            setCarregando(false);

        }
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
                    Crie sua conta!
                </Text>

                <Text style={styles.subtitle}>
                    Cadastre-se para começar a desenvolver
                    seu perfil profissional.
                </Text>

            </View>

            {/* FORMULÁRIO */}

            <View style={styles.form}>

                <Text style={styles.label}>
                    Nome
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#94A3B8"
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                    autoCorrect={false}
                />

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

                <Text style={styles.label}>
                    Confirmar senha
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha novamente"
                    placeholderTextColor="#94A3B8"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                />

                {/* BOTÃO CADASTRAR */}

                <Pressable
                    style={[
                        styles.button,
                        carregando &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleCadastro}
                    disabled={carregando}
                >

                    {carregando ? (

                        <ActivityIndicator
                            color="#FFFFFF"
                        />

                    ) : (

                        <Text style={styles.buttonText}>
                            Criar minha conta
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

                {/* VOLTAR PARA LOGIN */}

                <View style={styles.loginContainer}>

                    <Text style={styles.loginDescription}>
                        Já possui uma conta?
                    </Text>

                    <Pressable
                        style={styles.loginButton}
                        onPress={() =>
                            navigation.replace("Login")
                        }
                    >

                        <Text style={styles.loginButtonText}>
                            Entrar na minha conta
                        </Text>

                    </Pressable>

                </View>

            </View>

            {/* RODAPÉ */}

            <Text style={styles.footer}>
                Faça parte do Talent Hub e desenvolva
                seu potencial profissional.
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
        marginBottom: 24,
    },

    logoContainer: {
        width: 68,
        height: 68,
        borderRadius: 21,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,

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
        fontSize: 24,
        fontWeight: "900",
        letterSpacing: 1,
    },

    title: {
        fontSize: 34,
        fontWeight: "900",
        color: "#0F172A",
        marginBottom: 6,
        letterSpacing: -0.5,
    },

    welcome: {
        fontSize: 22,
        fontWeight: "800",
        color: "#2563EB",
        textAlign: "center",
        marginBottom: 7,
    },

    subtitle: {
        width: "100%",
        fontSize: 15,
        lineHeight: 21,
        color: "#475569",
        textAlign: "center",
        paddingHorizontal: 8,
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
        marginBottom: 7,
    },

    input: {
        width: "100%",
        height: 50,
        borderWidth: 1.5,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 15,
        color: "#0F172A",
        backgroundColor: "#F8FAFC",
        marginBottom: 14,
    },

    button: {
        width: "100%",
        height: 54,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",
        marginTop: 4,

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
        marginVertical: 20,
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

    loginContainer: {
        alignItems: "center",
    },

    loginDescription: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 7,
    },

    loginButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
    },

    loginButtonText: {
        color: "#2563EB",
        fontSize: 15,
        fontWeight: "800",
    },

    footer: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        textAlign: "center",
        marginTop: 20,
        fontSize: 12,
        lineHeight: 18,
        color: "#94A3B8",
        fontWeight: "500",
    },

});