// components/AddCharacterCard.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, HelperText, Menu } from "react-native-paper";

export default function AddCharacterForm({
  newCharacter,
  setNewCharacter,
  addCharacter,
  categories,
  newCategory,
  setNewCategory,
  categoryConfig
}) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  const hasError = !newCharacter.trim();

  return (
    <View style={styles.container}>
      <TextInput
        label="Nome do Personagem"
        mode="outlined"
        value={newCharacter}
        onChangeText={setNewCharacter}
        style={styles.input}
        error={hasError}
      />
      <HelperText type="error" visible={hasError}>
        Digite um nome válido.
      </HelperText>

      {/* Dropdown de categorias */}
      <Menu
        visible={menuVisible}
        onDismiss={hideMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={showMenu}
            style={styles.dropdownButton}
            icon="chevron-down"
          >
            {categoryConfig[newCategory]?.icon} {newCategory}
          </Button>
        }
      >
        {categories.map((category) => (
          <Menu.Item
            key={category}
            title={`${categoryConfig[category]?.icon} ${category}`}
            onPress={() => {
              setNewCategory(category);
              hideMenu();
            }}
          />
        ))}
      </Menu>

      <Button
        mode="contained"
        style={styles.addButton}
        onPress={addCharacter}
        disabled={hasError}
      >
        ➕ Adicionar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2
  },
  input: {
    marginBottom: 10
  },
  dropdownButton: {
    marginBottom: 10,
    justifyContent: "flex-start"
  },
  addButton: {
    borderRadius: 8,
    backgroundColor: "#2ecc71"
  }
});
