import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Provider as PaperProvider,
  Snackbar,
  Dialog,
  Portal,
  Button,
  Text,
  Divider,
  SegmentedButtons,
  IconButton,
  Chip,
} from "react-native-paper";

import CharacterCard from "./components/CharacterCard";
import AddCharacterForm from "./components/AddCharacterCard";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [newCharacter, setNewCharacter] = useState("");
  const [newCategory, setNewCategory] = useState("Guerreiro");
  const [filter, setFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("name");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [dialogVisible, setDialogVisible] = useState(false);
  const [characterToRemove, setCharacterToRemove] = useState(null);

  const categories = ["Guerreiro", "Mago", "Arqueiro", "Clérigo", "Ladino"];
  const categoryConfig = {
    Guerreiro: { icon: "⚔️", color: "#e74c3c", bgColor: "#fff5f5" },
    Mago: { icon: "🔮", color: "#9b59b6", bgColor: "#f8f5ff" },
    Arqueiro: { icon: "🏹", color: "#27ae60", bgColor: "#f5fff8" },
    Clérigo: { icon: "✨", color: "#f39c12", bgColor: "#fffbf5" },
    Ladino: { icon: "🗡️", color: "#34495e", bgColor: "#f8f9fa" },
  };

  // Carrega personagens do armazenamento local
  useEffect(() => {
    AsyncStorage.getItem("characters").then((data) => {
      if (data) setCharacters(JSON.parse(data));
    });
  }, []);

  // Salva personagens sempre que a lista mudar
  useEffect(() => {
    AsyncStorage.setItem("characters", JSON.stringify(characters));
  }, [characters]);

  const filteredAndSortedCharacters = useMemo(() => {
    let filtered = characters;
    if (filter === "recrutados") filtered = characters.filter((c) => c.recruited);
    else if (filter === "disponíveis") filtered = characters.filter((c) => !c.recruited);

    return filtered.sort((a, b) => {
      if (sortBy === "level") return b.level - a.level;
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
  }, [characters, filter, sortBy]);

  function addCharacter() {
    const trimmedName = newCharacter.trim();
    if (!trimmedName) return;

    if (characters.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setSnackbarMessage("⚠️ Já existe um personagem com esse nome!");
      setSnackbarVisible(true);
      return;
    }

    const newId = Math.max(...characters.map((c) => c.id), 0) + 1;
    const randomLevel = Math.floor(Math.random() * 50) + 20;
    const newChar = {
      id: newId,
      name: trimmedName,
      recruited: false,
      favorite: false,
      category: newCategory,
      level: randomLevel,
    };

    LayoutAnimation.easeInEaseOut();
    setCharacters([newChar, ...characters]);
    setNewCharacter("");
    setSnackbarMessage(`✅ ${trimmedName} foi adicionado!`);
    setSnackbarVisible(true);
  }

  function toggleRecruit(character) {
    LayoutAnimation.easeInEaseOut();
    const updated = characters.map((c) =>
      c.id === character.id ? { ...c, recruited: !c.recruited } : c
    );
    setCharacters(updated);
    setSnackbarMessage(
      character.recruited ? "🚪 Herói removido da party" : "👥 Herói recrutado!"
    );
    setSnackbarVisible(true);
  }

  function toggleFavorite(character) {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === character.id ? { ...c, favorite: !c.favorite } : c
      )
    );
  }

  function levelUp(character) {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === character.id ? { ...c, level: c.level + 1 } : c
      )
    );
  }

  function recruitAll() {
    LayoutAnimation.easeInEaseOut();
    setCharacters((prev) => prev.map((c) => ({ ...c, recruited: true })));
    setSnackbarMessage("✅ Todos os heróis foram recrutados!");
    setSnackbarVisible(true);
  }

  function resetParty() {
    Alert.alert("Resetar Party", "Deseja remover todos os personagens?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => {
          LayoutAnimation.easeInEaseOut();
          setCharacters([]);
          setSnackbarMessage("🗑️ Party resetada!");
          setSnackbarVisible(true);
        },
      },
    ]);
  }

  function confirmRemoveCharacter(character) {
    setCharacterToRemove(character);
    setDialogVisible(true);
  }

  function removeCharacterConfirmed() {
    if (characterToRemove) {
      LayoutAnimation.easeInEaseOut();
      setCharacters(characters.filter((c) => c.id !== characterToRemove.id));
      setSnackbarMessage(`🗑️ ${characterToRemove.name} foi removido!`);
      setSnackbarVisible(true);
    }
    setDialogVisible(false);
  }

  const total = characters.length;
  const recrutados = characters.filter((c) => c.recruited).length;
  const disponiveis = total - recrutados;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>⚔️ ADVENTURE PARTY ⚔️</Text>

        {/* Contadores */}
        <View style={styles.stats}>
          <Chip icon="account-group">Total: {total}</Chip>
          <Chip icon="check">Recrutados: {recrutados}</Chip>
          <Chip icon="account-off-outline">Disponíveis: {disponiveis}</Chip>
        </View>

        <AddCharacterForm
          newCharacter={newCharacter}
          setNewCharacter={setNewCharacter}
          addCharacter={addCharacter}
          categories={categories}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          categoryConfig={categoryConfig}
          placeholder="Digite o nome do personagem..."
        />

        {/* Filtro e Ordenação */}
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          style={{ marginBottom: 10 }}
          buttons={[
            { value: "todos", label: "Todos" },
            { value: "recrutados", label: "Recrutados" },
            { value: "disponíveis", label: "Disponíveis" },
          ]}
        />
        <SegmentedButtons
          value={sortBy}
          onValueChange={setSortBy}
          style={{ marginBottom: 15 }}
          buttons={[
            { value: "name", label: "Nome" },
            { value: "level", label: "Nível" },
            { value: "category", label: "Categoria" },
          ]}
        />

        <Divider style={{ marginBottom: 10 }} />

        <FlatList
          data={filteredAndSortedCharacters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CharacterCard
              item={item}
              onToggleRecruit={toggleRecruit}
              onRemove={confirmRemoveCharacter}
              onToggleFavorite={toggleFavorite}
              onLevelUp={levelUp}
              categoryConfig={categoryConfig}
              highlight={item.recruited}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum herói encontrado</Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />

        {/* Ações rápidas */}
        {characters.length > 0 && (
          <View style={styles.actions}>
            <Button
              mode="contained-tonal"
              icon="account-multiple-check"
              onPress={recruitAll}
            >
              Recrutar Todos
            </Button>
            <Button
              mode="outlined"
              icon="delete"
              textColor="red"
              onPress={resetParty}
            >
              Resetar Party
            </Button>
          </View>
        )}

        {/* Modal de confirmação */}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Remover Personagem</Dialog.Title>
            <Dialog.Content>
              <Text>Deseja remover {characterToRemove?.name} da sua party?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
              <Button textColor="red" onPress={removeCharacterConfirmed}>
                Remover
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Snackbar de feedback */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  empty: { textAlign: "center", color: "#7f8c8d", marginTop: 20, fontStyle: "italic" },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
