import React from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { limparAutenticacao } from "../services/StorageService";

export default function HomeScreen() {

    const navigation = useNavigation();

    async function handleLogout() {

        await limparAutenticacao();

        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    }

    function handleMinhasSkills() {
        navigation.navigate("Skills");
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Talent Hub
            </Text>

            <Text style={styles.subtitle}>
                Bem-vindo ao Talent Hub!
            </Text>

            <Pressable
                style={styles.skillsButton}
                onPress={handleMinhasSkills}
            >
                <Text style={styles.buttonText}>
                    Minhas Skills
                </Text>
            </Pressable>

            <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>
                    Sair
                </Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 18,
        marginBottom: 30,
    },

    skillsButton: {
        width: "100%",
        maxWidth: 400,
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2563EB",
        marginBottom: 16,
    },

    logoutButton: {
        width: "100%",
        maxWidth: 400,
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DC2626",
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});