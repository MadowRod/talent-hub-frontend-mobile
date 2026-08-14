import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import CadastroScreen from "../screens/CadastroScreen";
import HomeScreen from "../screens/HomeScreen";
import SkillsScreen from "../screens/SkillsScreen";

import {
    obterToken,
    obterPreferenciaLembrar,
} from "../services/StorageService";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        verificarAutenticacao();
    }, []);

    async function verificarAutenticacao() {

        try {

            const token = await obterToken();
            const lembrarMe = await obterPreferenciaLembrar();

            if (token && lembrarMe) {
                setInitialRoute("Home");
            } else {
                setInitialRoute("Login");
            }

        } catch (error) {

            console.error(
                "Erro ao verificar autenticação:",
                error
            );

            setInitialRoute("Login");
        }
    }

    if (initialRoute === null) {
        return null;
    }

    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />

            <Stack.Screen
                name="Cadastro"
                component={CadastroScreen}
            />

            <Stack.Screen
                name="Home"
                component={HomeScreen}
            />

            <Stack.Screen
                name="Skills"
                component={SkillsScreen}
            />

        </Stack.Navigator>
    );
}