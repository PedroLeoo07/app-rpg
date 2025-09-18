import React, { useState, useMemo } from "react";
import { View, FlatList, LayoutAnimation, UIManager, Platform, StyleSheet } from "react-native";
import { Provider as PaperProvider, Snackbar, Dialog, Portal, Button, Text } from "react-native-paper";
import CharacterCard from "./components/CharacterCard";
import AddCharacterForm from "./components/AddCharacterCard";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [characters, setCharacters] = useState([
    { id: 1, name: "Gandalf o Sábio", recruited: false, category: "Mago", level: 85 },
    { id: 2, name: "Aragorn o Valente", recruited: true, category: "Guerreiro", level: 72 },
    { id: 3, name: "Legolas o Preciso", recruited: false, category: "Arqueiro", level: 68 }
  ]);

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
    "Guerreiro": { icon: "⚔️", color: "#e74c3c", bgColor: "#fff5f5" },
    "Mago": { icon: "🔮", color: "#9b59b6", bgColor: "#f8f5ff" },
    "Arqueiro": { icon: "🏹", color: "#27ae60", bgColor: "#f5fff8" },
    "Clérigo": { icon: "✨", color: "#f39c12", bgColor: "#fffbf5" },
    "Ladino": { icon: "🗡️", color: "#34495e", bgColor: "#f8f9fa" }
  };

  const filteredAndSortedCharacters = useMemo(() => {
    let filtered = characters;
    if (filter === "recrutados") filtered = characters.filter(c => c.recruited);
    else if (filter === "disponíveis") filtered = characters.filter(c => !c.recruited);

    return filtered.sort((a, b) => {
      if (sortBy === "level") return b.level - a.level;
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
  }, [characters, filter, sortBy]);

  function addCharacter() {
    const trimmedName = newCharacter.trim();
    if (!trimmedName) return;

    if (characters.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setSnackbarMessage("⚠️ Já existe um personagem com esse nome!");
      setSnackbarVisible(true);
      return;
    }

    const newId = Math.max(...characters.map(c => c.id), 0) + 1;
    const randomLevel = Math.floor(Math.random() * 50) + 20;
    const newChar = { id: newId, name: trimmedName, recruited: false, category: newCategory, level: randomLevel };

    LayoutAnimation.easeInEaseOut();
    setCharacters([newChar, ...characters]);
    setNewCharacter("");
    setSnackbarMessage(`✅ ${trimmedName} foi adicionado!`);
    setSnackbarVisible(true);
  }

  function toggleRecruit(character) {
    LayoutAnimation.easeInEaseOut();
    const updated = characters.map(c => c.id === character.id ? { ...c, recruited: !c.recruited } : c);
    setCharacters(updated);
    setSnackbarMessage(character.recruited ? "🚪 Herói removido da party" : "👥 Herói recrutado!");
    setSnackbarVisible(true);
  }

  function confirmRemoveCharacter(character) {
    setCharacterToRemove(character);
    setDialogVisible(true);
  }

  function removeCharacterConfirmed() {
    if (characterToRemove) {
      LayoutAnimation.easeInEaseOut();
      setCharacters(characters.filter(c => c.id !== characterToRemove.id));
      setSnackbarMessage(`🗑️ ${characterToRemove.name} foi removido!`);
      setSnackbarVisible(true);
    }
    setDialogVisible(false);
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>⚔️ ADVENTURE PARTY ⚔️</Text>

        <AddCharacterForm
          newCharacter={newCharacter}
          setNewCharacter={setNewCharacter}
          addCharacter={addCharacter}
          categories={categories}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          categoryConfig={categoryConfig}
        />

        <FlatList
          data={filteredAndSortedCharacters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CharacterCard
              item={item}
              onToggleRecruit={toggleRecruit}
              onRemove={confirmRemoveCharacter}
              categoryConfig={categoryConfig}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum herói encontrado</Text>}
        />

        {/* Modal de confirmação */}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Remover Personagem</Dialog.Title>
            <Dialog.Content>
              <Text>Deseja remover {characterToRemove?.name} da sua party?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
              <Button textColor="red" onPress={removeCharacterConfirmed}>Remover</Button>
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
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  empty: { textAlign: "center", color: "#7f8c8d", marginTop: 20 }
});
