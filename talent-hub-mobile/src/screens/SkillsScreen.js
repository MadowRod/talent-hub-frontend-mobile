import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Modal,
    Alert,
    StatusBar,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import {
    listarMinhasSkills,
    adicionarSkill,
    atualizarLevel,
    excluirSkill,
} from "../services/UsuarioSkillService";

import { listarSkills } from "../services/SkillsService";
import { limparAutenticacao } from "../services/StorageService";

export default function SkillsScreen() {
    const navigation = useNavigation();

    const [skills, setSkills] = useState([]);
    const [skillsDisponiveis, setSkillsDisponiveis] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [skillSelecionada, setSkillSelecionada] = useState(null);
    const [levelSelecionado, setLevelSelecionado] = useState("");
    const [adicionando, setAdicionando] = useState(false);
    const [modalEditarAberto, setModalEditarAberto] = useState(false);
    const [skillEditando, setSkillEditando] = useState(null);
    const [novoLevel, setNovoLevel] = useState("");
    const [salvandoLevel, setSalvandoLevel] = useState(false);
    const [excluindoSkill, setExcluindoSkill] = useState(false);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [skillExcluindo, setSkillExcluindo] = useState(null);

    useEffect(() => {
        carregarSkills();
    }, []);

    // Carrega as skills associadas ao usuário.
    async function carregarSkills() {
        try {
            setCarregando(true);
            setErro(false);

            const minhasSkills = await listarMinhasSkills();
            setSkills(minhasSkills);
        } catch (error) {
            setErro(true);
        } finally {
            setCarregando(false);
        }
    }

    // Encerra a sessão e retorna o usuário para a tela de login.
    async function handleSair() {
        try {
            await limparAutenticacao();

            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            });
        } catch (error) {
        }
    }

    // Busca as skills disponíveis e abre o modal de adição.
    async function abrirModalAdicionar() {
        try {
            const disponiveis = await listarSkills();

            setSkillsDisponiveis(disponiveis);
            setSkillSelecionada(null);
            setLevelSelecionado("");
            setModalAberto(true);
        } catch (error) {
        }
    }

    // Define a skill escolhida pelo usuário.
    function selecionarSkill(skill) {
        setSkillSelecionada(skill);
        setLevelSelecionado("");
    }

    // Define o nível escolhido para a nova skill.
    function selecionarLevel(level) {
        setLevelSelecionado(level);
    }

    // Adiciona a skill selecionada ao perfil do usuário.
    async function confirmarAdicao() {
        if (!skillSelecionada) {
            return;
        }

        if (!levelSelecionado) {
            return;
        }

        try {
            setAdicionando(true);

            await adicionarSkill(
                skillSelecionada.id,
                levelSelecionado
            );

            setModalAberto(false);
            setSkillSelecionada(null);
            setLevelSelecionado("");

            await carregarSkills();
        } catch (error) {
        } finally {
            setAdicionando(false);
        }
    }

    // Abre o modal para alteração do nível de uma skill.
    function abrirModalEditar(item) {
        setSkillEditando(item);
        setNovoLevel(item.level);
        setModalEditarAberto(true);
    }

    // Define o novo nível selecionado para edição.
    function selecionarNovoLevel(level) {
        setNovoLevel(level);
    }

    // Atualiza o nível da skill selecionada.
    async function salvarNovoLevel() {
        if (!skillEditando) {
            return;
        }

        if (!novoLevel) {
            return;
        }

        if (novoLevel === skillEditando.level) {
            setModalEditarAberto(false);
            return;
        }

        try {
            setSalvandoLevel(true);

            await atualizarLevel(
                skillEditando.id,
                novoLevel
            );

            setModalEditarAberto(false);
            setSkillEditando(null);
            setNovoLevel("");

            await carregarSkills();
        } catch (error) {
        } finally {
            setSalvandoLevel(false);
        }
    }

    // Fecha o modal de edição de nível.
    function fecharModalEditar() {
        if (salvandoLevel) {
            return;
        }

        setModalEditarAberto(false);
        setSkillEditando(null);
        setNovoLevel("");
    }

    // Abre o modal de confirmação para exclusão da skill.
    function confirmarExclusao(item) {
        setSkillExcluindo(item);
        setModalExcluirAberto(true);
    }

    // Remove a skill do perfil do usuário.
    async function executarExclusao(item) {
        try {
            setExcluindoSkill(true);

            await excluirSkill(item.id);

            setSkills((skillsAtuais) =>
                skillsAtuais.filter(
                    (skill) => skill.id !== item.id
                )
            );

            setModalExcluirAberto(false);
            setSkillExcluindo(null);
        } catch (error) {
            Alert.alert(
                "Erro",
                "Não foi possível excluir a skill."
            );
        } finally {
            setExcluindoSkill(false);
        }
    }

    // Fecha o modal de confirmação de exclusão.
    function fecharModalExcluir() {
        if (excluindoSkill) {
            return;
        }

        setModalExcluirAberto(false);
        setSkillExcluindo(null);
    }

    // Converte o nível retornado pela API para o texto exibido na tela.
    function getLevelLabel(level) {
        if (level === "BASICO") {
            return "Básico";
        }

        if (level === "INTERMEDIARIO") {
            return "Intermediário";
        }

        if (level === "AVANCADO") {
            return "Avançado";
        }

        return level;
    }

    // Renderiza cada skill cadastrada pelo usuário.
    function renderSkill({ item }) {
        return (
            <View style={styles.cardWrapper}>
                <LinearGradient
                    colors={["#FFFFFF", "#F8FAFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.cardTop}>
                        <View style={styles.skillIcon}>
                            <Text style={styles.skillIconText}>
                                {item.skillNome
                                    ? item.skillNome.charAt(0).toUpperCase()
                                    : "S"}
                            </Text>
                        </View>

                        <View style={styles.skillInfo}>
                            <Text style={styles.skillName}>
                                {item.skillNome}
                            </Text>

                            <Text style={styles.category}>
                                {item.categoriaNome}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        {item.skillDescricao ||
                            "Nenhuma descrição disponível para esta skill."}
                    </Text>

                    <View style={styles.levelContainer}>
                        <View>
                            <Text style={styles.levelLabel}>
                                NÍVEL DE EXPERIÊNCIA
                            </Text>

                            <Text style={styles.level}>
                                {getLevelLabel(item.level)}
                            </Text>
                        </View>

                        <View style={styles.levelBadge}>
                            <Text style={styles.levelBadgeText}>
                                {item.level === "BASICO"
                                    ? "1"
                                    : item.level === "INTERMEDIARIO"
                                        ? "2"
                                        : "3"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.actions}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.editButton,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={() => abrirModalEditar(item)}
                            disabled={excluindoSkill}
                        >
                            <Text style={styles.editButtonIcon}>
                                ✎
                            </Text>

                            <Text style={styles.editButtonText}>
                                Editar nível
                            </Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.deleteButton,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={() => confirmarExclusao(item)}
                            disabled={excluindoSkill}
                        >
                            <Text style={styles.deleteButtonIcon}>
                                ×
                            </Text>

                            <Text style={styles.deleteButtonText}>
                                Excluir
                            </Text>
                        </Pressable>
                    </View>
                </LinearGradient>
            </View>
        );
    }

    if (carregando) {
        return (
            <LinearGradient
                colors={["#EFF6FF", "#FFFFFF"]}
                style={styles.center}
            >
                <View style={styles.loadingCircle}>
                    <ActivityIndicator
                        size="large"
                        color="#2563EB"
                    />
                </View>

                <Text style={styles.loadingTitle}>
                    Carregando suas skills
                </Text>

                <Text style={styles.loadingText}>
                    Aguarde um momento...
                </Text>
            </LinearGradient>
        );
    }

    if (erro) {
        return (
            <LinearGradient
                colors={["#EFF6FF", "#FFFFFF"]}
                style={styles.center}
            >
                <View style={styles.errorIcon}>
                    <Text style={styles.errorIconText}>
                        !
                    </Text>
                </View>

                <Text style={styles.errorTitle}>
                    Não foi possível carregar suas skills.
                </Text>

                <Pressable
                    style={styles.retryButton}
                    onPress={carregarSkills}
                >
                    <Text style={styles.retryButtonText}>
                        Tentar novamente
                    </Text>
                </Pressable>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={["#EEF5FF", "#FFFFFF", "#F8FAFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#EEF5FF"
            />

            <View style={styles.header}>
                <View style={styles.headerText}>
                    <View style={styles.titleRow}>
                        <View style={styles.titleAccent} />

                        <Text style={styles.title}>
                            Minhas Skills
                        </Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Gerencie suas habilidades e destaque
                        seu perfil profissional.
                    </Text>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={handleSair}
                >
                    <Text style={styles.logoutIcon}>
                        ↪
                    </Text>

                    <Text style={styles.logoutButtonText}>
                        Sair
                    </Text>
                </Pressable>
            </View>

            <LinearGradient
                colors={["#2563EB", "#1D4ED8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
            >
                <Pressable
                    style={styles.addButton}
                    onPress={abrirModalAdicionar}
                >
                    <View style={styles.addIconCircle}>
                        <Text style={styles.addIcon}>
                            +
                        </Text>
                    </View>

                    <View>
                        <Text style={styles.addButtonTitle}>
                            Adicionar Skill
                        </Text>

                        <Text style={styles.addButtonSubtitle}>
                            Adicione uma nova habilidade
                        </Text>
                    </View>
                </Pressable>
            </LinearGradient>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    Suas habilidades
                </Text>

                <View style={styles.counterBadge}>
                    <Text style={styles.counterText}>
                        {skills.length}
                    </Text>
                </View>
            </View>

            {skills.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Text style={styles.emptyIconText}>
                            +
                        </Text>
                    </View>

                    <Text style={styles.emptyTitle}>
                        Nenhuma skill adicionada
                    </Text>

                    <Text style={styles.emptyText}>
                        Adicione suas habilidades para
                        deixar seu perfil mais completo.
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.emptyAddButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={abrirModalAdicionar}
                    >
                        <Text style={styles.emptyAddButtonText}>
                            + Adicionar minha primeira skill
                        </Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    data={skills}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderSkill}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* MODAL ADICIONAR SKILL */}

            <Modal
                visible={modalAberto}
                transparent={true}
                animationType="slide"
                onRequestClose={() => {
                    if (!adicionando) {
                        setModalAberto(false);
                        setSkillSelecionada(null);
                        setLevelSelecionado("");
                    }
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>
                                    Adicionar Skill
                                </Text>

                                <Text style={styles.modalSubtitle}>
                                    Escolha uma habilidade para seu perfil.
                                </Text>
                            </View>

                            <Pressable
                                style={styles.modalClose}
                                onPress={() => {
                                    if (!adicionando) {
                                        setModalAberto(false);
                                        setSkillSelecionada(null);
                                        setLevelSelecionado("");
                                    }
                                }}
                            >
                                <Text style={styles.modalCloseText}>
                                    ×
                                </Text>
                            </Pressable>
                        </View>

                        {!skillSelecionada ? (
                            <>
                                {skillsDisponiveis.length === 0 ? (
                                    <View style={styles.emptyModal}>
                                        <ActivityIndicator
                                            size="small"
                                            color="#2563EB"
                                        />

                                        <Text style={styles.emptyModalText}>
                                            Carregando skills...
                                        </Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={skillsDisponiveis}
                                        keyExtractor={(item) => String(item.id)}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <Pressable
                                                style={({ pressed }) => [
                                                    styles.availableSkill,
                                                    pressed &&
                                                    styles.availableSkillPressed,
                                                ]}
                                                onPress={() =>
                                                    selecionarSkill(item)
                                                }
                                            >
                                                <View style={styles.availableSkillIcon}>
                                                    <Text style={styles.availableSkillIconText}>
                                                        {item.nome
                                                            ? item.nome.charAt(0).toUpperCase()
                                                            : "S"}
                                                    </Text>
                                                </View>

                                                <View style={styles.availableSkillContent}>
                                                    <Text style={styles.availableSkillName}>
                                                        {item.nome}
                                                    </Text>

                                                    <Text style={styles.availableSkillCategory}>
                                                        {item.categoriaNome}
                                                    </Text>

                                                    {item.descricao && (
                                                        <Text
                                                            style={styles.availableSkillDescription}
                                                            numberOfLines={2}
                                                        >
                                                            {item.descricao}
                                                        </Text>
                                                    )}
                                                </View>

                                                <Text style={styles.arrow}>
                                                    ›
                                                </Text>
                                            </Pressable>
                                        )}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                <Text style={styles.selectedSkillLabel}>
                                    SKILL SELECIONADA
                                </Text>

                                <LinearGradient
                                    colors={["#EFF6FF", "#DBEAFE"]}
                                    style={styles.selectedSkill}
                                >
                                    <View style={styles.selectedSkillIcon}>
                                        <Text style={styles.selectedSkillIconText}>
                                            {skillSelecionada.nome
                                                ? skillSelecionada.nome.charAt(0).toUpperCase()
                                                : "S"}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text style={styles.selectedSkillName}>
                                            {skillSelecionada.nome}
                                        </Text>

                                        <Text style={styles.availableSkillCategory}>
                                            {skillSelecionada.categoriaNome}
                                        </Text>
                                    </View>
                                </LinearGradient>

                                <Text style={styles.levelTitle}>
                                    Selecione seu nível
                                </Text>

                                <Pressable
                                    style={[
                                        styles.levelButton,
                                        levelSelecionado === "BASICO" &&
                                        styles.levelButtonSelected,
                                    ]}
                                    onPress={() => selecionarLevel("BASICO")}
                                >
                                    <View style={styles.levelNumber}>
                                        <Text
                                            style={[
                                                styles.levelNumberText,
                                                levelSelecionado === "BASICO" &&
                                                styles.levelNumberTextSelected,
                                            ]}
                                        >
                                            1
                                        </Text>
                                    </View>

                                    <View style={styles.levelTextContainer}>
                                        <Text
                                            style={[
                                                styles.levelButtonText,
                                                levelSelecionado === "BASICO" &&
                                                styles.levelButtonTextSelected,
                                            ]}
                                        >
                                            Básico
                                        </Text>

                                        <Text
                                            style={[
                                                styles.levelDescription,
                                                levelSelecionado === "BASICO" &&
                                                styles.levelDescriptionSelected,
                                            ]}
                                        >
                                            Conhecimentos fundamentais
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={[
                                        styles.levelButton,
                                        levelSelecionado === "INTERMEDIARIO" &&
                                        styles.levelButtonSelected,
                                    ]}
                                    onPress={() =>
                                        selecionarLevel("INTERMEDIARIO")
                                    }
                                >
                                    <View style={styles.levelNumber}>
                                        <Text
                                            style={[
                                                styles.levelNumberText,
                                                levelSelecionado === "INTERMEDIARIO" &&
                                                styles.levelNumberTextSelected,
                                            ]}
                                        >
                                            2
                                        </Text>
                                    </View>

                                    <View style={styles.levelTextContainer}>
                                        <Text
                                            style={[
                                                styles.levelButtonText,
                                                levelSelecionado === "INTERMEDIARIO" &&
                                                styles.levelButtonTextSelected,
                                            ]}
                                        >
                                            Intermediário
                                        </Text>

                                        <Text
                                            style={[
                                                styles.levelDescription,
                                                levelSelecionado === "INTERMEDIARIO" &&
                                                styles.levelDescriptionSelected,
                                            ]}
                                        >
                                            Experiência prática
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={[
                                        styles.levelButton,
                                        levelSelecionado === "AVANCADO" &&
                                        styles.levelButtonSelected,
                                    ]}
                                    onPress={() =>
                                        selecionarLevel("AVANCADO")
                                    }
                                >
                                    <View style={styles.levelNumber}>
                                        <Text
                                            style={[
                                                styles.levelNumberText,
                                                levelSelecionado === "AVANCADO" &&
                                                styles.levelNumberTextSelected,
                                            ]}
                                        >
                                            3
                                        </Text>
                                    </View>

                                    <View style={styles.levelTextContainer}>
                                        <Text
                                            style={[
                                                styles.levelButtonText,
                                                levelSelecionado === "AVANCADO" &&
                                                styles.levelButtonTextSelected,
                                            ]}
                                        >
                                            Avançado
                                        </Text>

                                        <Text
                                            style={[
                                                styles.levelDescription,
                                                levelSelecionado === "AVANCADO" &&
                                                styles.levelDescriptionSelected,
                                            ]}
                                        >
                                            Domínio da habilidade
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={[
                                        styles.confirmButton,
                                        (!levelSelecionado || adicionando) &&
                                        styles.confirmButtonDisabled,
                                    ]}
                                    disabled={!levelSelecionado || adicionando}
                                    onPress={confirmarAdicao}
                                >
                                    {adicionando ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.confirmButtonText}>
                                            Adicionar Skill
                                        </Text>
                                    )}
                                </Pressable>

                                <Pressable
                                    style={styles.backButton}
                                    onPress={() => {
                                        setSkillSelecionada(null);
                                        setLevelSelecionado("");
                                    }}
                                    disabled={adicionando}
                                >
                                    <Text style={styles.backButtonText}>
                                        ← Escolher outra skill
                                    </Text>
                                </Pressable>
                            </>
                        )}

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => {
                                setModalAberto(false);
                                setSkillSelecionada(null);
                                setLevelSelecionado("");
                            }}
                            disabled={adicionando}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancelar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* MODAL EDITAR NÍVEL */}

            <Modal
                visible={modalEditarAberto}
                transparent={true}
                animationType="slide"
                onRequestClose={fecharModalEditar}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>
                                    Editar nível
                                </Text>

                                <Text style={styles.modalSubtitle}>
                                    Atualize seu nível de experiência.
                                </Text>
                            </View>

                            <Pressable
                                style={styles.modalClose}
                                onPress={fecharModalEditar}
                                disabled={salvandoLevel}
                            >
                                <Text style={styles.modalCloseText}>
                                    ×
                                </Text>
                            </Pressable>
                        </View>

                        {skillEditando && (
                            <>
                                <LinearGradient
                                    colors={["#EFF6FF", "#DBEAFE"]}
                                    style={styles.selectedSkill}
                                >
                                    <View style={styles.selectedSkillIcon}>
                                        <Text style={styles.selectedSkillIconText}>
                                            {skillEditando.skillNome
                                                ? skillEditando.skillNome.charAt(0).toUpperCase()
                                                : "S"}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text style={styles.selectedSkillName}>
                                            {skillEditando.skillNome}
                                        </Text>

                                        <Text style={styles.availableSkillCategory}>
                                            {skillEditando.categoriaNome}
                                        </Text>
                                    </View>
                                </LinearGradient>

                                <View style={styles.currentLevelBox}>
                                    <Text style={styles.currentLevelLabel}>
                                        NÍVEL ATUAL
                                    </Text>

                                    <Text style={styles.currentLevel}>
                                        {getLevelLabel(skillEditando.level)}
                                    </Text>
                                </View>

                                <Text style={styles.levelTitle}>
                                    Selecione o novo nível
                                </Text>

                                <Pressable
                                    style={[
                                        styles.levelButton,
                                        novoLevel === "BASICO" &&
                                        styles.levelButtonSelected,
                                    ]}
                                    onPress={() =>
                                        selecionarNovoLevel("BASICO")
                                    }
                                    disabled={salvandoLevel}
                                >
                                    <View style={styles.levelNumber}>
                                        <Text
                                            style={[
                                                styles.levelNumberText,
                                                novoLevel === "BASICO" &&
                                                styles.levelNumberTextSelected,
                                            ]}
                                        >
                                            1
                                        </Text>
                                    </View>

                                    <View style={styles.levelTextContainer}>
                                        <Text
                                            style={[
                                                styles.levelButtonText,
                                                novoLevel === "BASICO" &&
                                                styles.levelButtonTextSelected,
                                            ]}
                                        >
                                            Básico
                                        </Text>

                                        <Text
                                            style={[
                                                styles.levelDescription,
                                                novoLevel === "BASICO" &&
                                                styles.levelDescriptionSelected,
                                            ]}
                                        >
                                            Conhecimentos fundamentais
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={[
                                        styles.levelButton,
                                        novoLevel === "INTERMEDIARIO" &&
                                        styles.levelButtonSelected,
                                    ]}
                                    onPress={() =>
                                        selecionarNovoLevel("INTERMEDIARIO")
                                    }
                                    disabled={salvandoLevel}
                                >
                                    <View style={styles.levelNumber}>
                                        <Text
                                            style={[
                                                styles.levelNumberText,
                                                novoLevel === "INTERMEDIARIO" &&
                                                styles.levelNumberTextSelected,
                                            ]}
                                        >
                                            2
                                        </Text>
                                    </View>

                                    <View style={styles.levelTextContainer}>
                                        <Text
                                            style={[
                                                styles.levelButtonText,
                                                novoLevel === "INTERMEDIARIO" &&
                                                styles.levelButtonTextSelected,
                                            ]}
                                        >
                                            Intermediário
                                        </Text>

                                        <Text
                                            style={[
                                                styles.levelDescription,
                                                novoLevel === "INTERMEDIARIO" &&
                                                styles.levelDescriptionSelected,
                                            ]}
                                        >
                                            Experiência prática
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={[
                                        styles.levelButton,
                                        novoLevel === "AVANCADO" &&
                                        styles.levelButtonSelected,
                                    ]}
                                    onPress={() =>
                                        selecionarNovoLevel("AVANCADO")
                                    }
                                    disabled={salvandoLevel}
                                >
                                    <View style={styles.levelNumber}>
                                        <Text
                                            style={[
                                                styles.levelNumberText,
                                                novoLevel === "AVANCADO" &&
                                                styles.levelNumberTextSelected,
                                            ]}
                                        >
                                            3
                                        </Text>
                                    </View>

                                    <View style={styles.levelTextContainer}>
                                        <Text
                                            style={[
                                                styles.levelButtonText,
                                                novoLevel === "AVANCADO" &&
                                                styles.levelButtonTextSelected,
                                            ]}
                                        >
                                            Avançado
                                        </Text>

                                        <Text
                                            style={[
                                                styles.levelDescription,
                                                novoLevel === "AVANCADO" &&
                                                styles.levelDescriptionSelected,
                                            ]}
                                        >
                                            Domínio da habilidade
                                        </Text>
                                    </View>
                                </Pressable>

                                <Pressable
                                    style={[
                                        styles.confirmButton,
                                        (!novoLevel || salvandoLevel) &&
                                        styles.confirmButtonDisabled,
                                    ]}
                                    disabled={!novoLevel || salvandoLevel}
                                    onPress={salvarNovoLevel}
                                >
                                    {salvandoLevel ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.confirmButtonText}>
                                            Salvar alteração
                                        </Text>
                                    )}
                                </Pressable>
                            </>
                        )}

                        <Pressable
                            style={styles.cancelButton}
                            onPress={fecharModalEditar}
                            disabled={salvandoLevel}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancelar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* MODAL EXCLUIR SKILL */}

            <Modal
                visible={modalExcluirAberto}
                transparent={true}
                animationType="fade"
                onRequestClose={fecharModalExcluir}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.deleteModal}>
                        <View style={styles.deleteIcon}>
                            <Text style={styles.deleteIconText}>
                                !
                            </Text>
                        </View>

                        <Text style={styles.modalTitle}>
                            Excluir skill?
                        </Text>

                        {skillExcluindo && (
                            <>
                                <Text style={styles.deleteDescription}>
                                    Deseja realmente remover esta skill
                                    do seu perfil?
                                </Text>

                                <View style={styles.deleteSkillBox}>
                                    <Text style={styles.deleteSkillName}>
                                        {skillExcluindo.skillNome}
                                    </Text>

                                    <Text style={styles.availableSkillCategory}>
                                        {skillExcluindo.categoriaNome}
                                    </Text>
                                </View>

                                <Pressable
                                    style={[
                                        styles.deleteConfirmButton,
                                        excluindoSkill &&
                                        styles.confirmButtonDisabled,
                                    ]}
                                    disabled={excluindoSkill}
                                    onPress={() =>
                                        executarExclusao(skillExcluindo)
                                    }
                                >
                                    {excluindoSkill ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.deleteConfirmButtonText}>
                                            Excluir skill
                                        </Text>
                                    )}
                                </Pressable>

                                <Pressable
                                    style={styles.cancelButton}
                                    disabled={excluindoSkill}
                                    onPress={fecharModalExcluir}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        Cancelar
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 55,
        paddingHorizontal: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 22,
    },
    headerText: {
        flex: 1,
        marginRight: 12,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    titleAccent: {
        width: 5,
        height: 30,
        borderRadius: 4,
        backgroundColor: "#2563EB",
        marginRight: 10,
    },
    title: {
        fontSize: 29,
        fontWeight: "900",
        color: "#172554",
        letterSpacing: -0.7,
    },
    subtitle: {
        fontSize: 14,
        color: "#64748B",
        lineHeight: 20,
        maxWidth: 290,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FCA5A5",
        backgroundColor: "#FEF2F2",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 9,
    },
    logoutIcon: {
        color: "#DC2626",
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 4,
    },
    logoutButtonText: {
        color: "#DC2626",
        fontSize: 13,
        fontWeight: "800",
    },
    addButtonGradient: {
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: "#1D4ED8",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 15,
    },
    addIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.20)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    addIcon: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "300",
    },
    addButtonTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "900",
        marginBottom: 2,
    },
    addButtonSubtitle: {
        color: "#DBEAFE",
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: "900",
        color: "#172554",
    },
    counterBadge: {
        minWidth: 27,
        height: 27,
        borderRadius: 14,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 9,
        paddingHorizontal: 7,
    },
    counterText: {
        color: "#2563EB",
        fontSize: 13,
        fontWeight: "900",
    },
    list: {
        paddingBottom: 30,
    },
    cardWrapper: {
        marginBottom: 16,
        borderRadius: 18,
        shadowColor: "#1E3A8A",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.10,
        shadowRadius: 10,
        elevation: 4,
    },
    card: {
        borderWidth: 1,
        borderColor: "#DBEAFE",
        borderRadius: 18,
        padding: 18,
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    skillIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
        shadowColor: "#2563EB",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 3,
    },
    skillIconText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "900",
    },
    skillInfo: {
        flex: 1,
    },
    skillName: {
        fontSize: 21,
        fontWeight: "900",
        color: "#172554",
        marginBottom: 4,
    },
    category: {
        fontSize: 12,
        color: "#2563EB",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 14,
        color: "#64748B",
        lineHeight: 20,
        marginBottom: 16,
    },
    levelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    levelLabel: {
        color: "#94A3B8",
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 0.7,
        marginBottom: 4,
    },
    level: {
        fontSize: 17,
        fontWeight: "900",
        color: "#1D4ED8",
    },
    levelBadge: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
    },
    levelBadgeText: {
        color: "#2563EB",
        fontSize: 16,
        fontWeight: "900",
    },
    divider: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 15,
    },
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    editButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#93C5FD",
        backgroundColor: "#EFF6FF",
        borderRadius: 11,
        paddingVertical: 11,
    },
    editButtonIcon: {
        color: "#2563EB",
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 6,
    },
    editButtonText: {
        color: "#1D4ED8",
        fontSize: 13,
        fontWeight: "900",
    },
    deleteButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FCA5A5",
        backgroundColor: "#FEF2F2",
        borderRadius: 11,
        paddingVertical: 11,
    },
    deleteButtonIcon: {
        color: "#DC2626",
        fontSize: 21,
        fontWeight: "bold",
        marginRight: 5,
    },
    deleteButtonText: {
        color: "#DC2626",
        fontSize: 13,
        fontWeight: "900",
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    loadingCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    loadingTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#172554",
    },
    loadingText: {
        marginTop: 5,
        fontSize: 14,
        color: "#64748B",
    },
    errorIcon: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#FEE2E2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    errorIconText: {
        color: "#DC2626",
        fontSize: 30,
        fontWeight: "900",
    },
    errorTitle: {
        fontSize: 16,
        color: "#334155",
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 24,
        paddingVertical: 13,
        borderRadius: 11,
    },
    retryButtonText: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 25,
        paddingBottom: 80,
    },
    emptyIcon: {
        width: 78,
        height: 78,
        borderRadius: 25,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    emptyIconText: {
        color: "#2563EB",
        fontSize: 40,
        fontWeight: "300",
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "900",
        color: "#172554",
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 21,
        maxWidth: 310,
    },
    emptyAddButton: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 20,
        paddingVertical: 13,
        borderRadius: 11,
        marginTop: 22,
    },
    emptyAddButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "900",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        justifyContent: "center",
        paddingHorizontal: 18,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 22,
        maxHeight: "88%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    deleteModal: {
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 18,
    },
    modalTitle: {
        fontSize: 23,
        fontWeight: "900",
        color: "#172554",
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 13,
        color: "#64748B",
        lineHeight: 19,
    },
    modalClose: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
    },
    modalCloseText: {
        fontSize: 24,
        color: "#64748B",
        lineHeight: 26,
    },
    emptyModal: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    emptyModalText: {
        marginTop: 12,
        color: "#64748B",
        fontSize: 14,
    },
    availableSkill: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        padding: 13,
        marginBottom: 10,
    },
    availableSkillPressed: {
        backgroundColor: "#EFF6FF",
        borderColor: "#93C5FD",
    },
    availableSkillIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },
    availableSkillIconText: {
        color: "#2563EB",
        fontSize: 18,
        fontWeight: "900",
    },
    availableSkillContent: {
        flex: 1,
    },
    availableSkillName: {
        fontSize: 16,
        fontWeight: "900",
        color: "#172554",
        marginBottom: 3,
    },
    availableSkillCategory: {
        fontSize: 12,
        color: "#2563EB",
        fontWeight: "800",
        marginBottom: 3,
    },
    availableSkillDescription: {
        fontSize: 12,
        color: "#64748B",
        lineHeight: 17,
    },
    arrow: {
        fontSize: 28,
        color: "#94A3B8",
        marginLeft: 8,
    },
    selectedSkillLabel: {
        fontSize: 10,
        fontWeight: "900",
        color: "#64748B",
        letterSpacing: 0.8,
        marginBottom: 7,
    },
    selectedSkill: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#BFDBFE",
    },
    selectedSkillIcon: {
        width: 44,
        height: 44,
        borderRadius: 13,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    selectedSkillIconText: {
        color: "#fff",
        fontSize: 19,
        fontWeight: "900",
    },
    selectedSkillName: {
        fontSize: 18,
        fontWeight: "900",
        color: "#172554",
        marginBottom: 3,
    },
    levelTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#172554",
        marginBottom: 11,
    },
    levelButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        borderRadius: 13,
        padding: 12,
        marginBottom: 9,
    },
    levelButtonSelected: {
        backgroundColor: "#2563EB",
        borderColor: "#2563EB",
    },
    levelNumber: {
        width: 35,
        height: 35,
        borderRadius: 11,
        backgroundColor: "#E0E7FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },
    levelNumberText: {
        color: "#2563EB",
        fontSize: 14,
        fontWeight: "900",
    },
    levelNumberTextSelected: {
        color: "#2563EB",
    },
    levelTextContainer: {
        flex: 1,
    },
    levelButtonText: {
        fontSize: 15,
        fontWeight: "900",
        color: "#172554",
        marginBottom: 2,
    },
    levelButtonTextSelected: {
        color: "#fff",
    },
    levelDescription: {
        fontSize: 11,
        color: "#64748B",
    },
    levelDescriptionSelected: {
        color: "#DBEAFE",
    },
    confirmButton: {
        backgroundColor: "#16A34A",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 7,
        shadowColor: "#16A34A",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.20,
        shadowRadius: 6,
        elevation: 3,
    },
    confirmButtonDisabled: {
        backgroundColor: "#94A3B8",
        shadowOpacity: 0,
        elevation: 0,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "900",
    },
    backButton: {
        marginTop: 5,
        paddingVertical: 11,
        alignItems: "center",
    },
    backButtonText: {
        color: "#2563EB",
        fontWeight: "800",
        fontSize: 13,
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 11,
        backgroundColor: "#F1F5F9",
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: "#475569",
    },
    currentLevelBox: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 12,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    currentLevelLabel: {
        fontSize: 10,
        fontWeight: "900",
        color: "#94A3B8",
        letterSpacing: 0.7,
        marginBottom: 4,
    },
    currentLevel: {
        fontSize: 16,
        color: "#2563EB",
        fontWeight: "900",
    },
    deleteIcon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#FEE2E2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    deleteIconText: {
        color: "#DC2626",
        fontSize: 28,
        fontWeight: "900",
    },
    deleteDescription: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 21,
        marginBottom: 15,
    },
    deleteSkillBox: {
        width: "100%",
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 13,
        padding: 14,
        marginBottom: 10,
    },
    deleteSkillName: {
        fontSize: 17,
        color: "#991B1B",
        fontWeight: "900",
        marginBottom: 3,
    },
    deleteConfirmButton: {
        width: "100%",
        backgroundColor: "#DC2626",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
    deleteConfirmButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "900",
    },
});