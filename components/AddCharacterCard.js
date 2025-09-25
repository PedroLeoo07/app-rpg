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
      <View style={styles.row}>
        <View style={styles.avatarPreview}>
          <TextInput
            value={categoryConfig[newCategory]?.icon}
            editable={false}
            style={styles.avatarIcon}
          />
        </View>
        <TextInput
          label="Nome do Personagem"
          mode="outlined"
          value={newCharacter}
          onChangeText={setNewCharacter}
          style={[styles.input, { flex: 1 }]}
          error={hasError}
        />
      </View>
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
            labelStyle={{ fontSize: 18 }}
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
        icon="plus-circle"
        labelStyle={{ fontSize: 18 }}
      >
        Adicionar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarPreview: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#eee',
    elevation: 1,
  },
  avatarIcon: {
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: '#333',
  },
  input: {
    marginBottom: 0,
  },
  dropdownButton: {
    marginBottom: 14,
    justifyContent: "flex-start",
    borderRadius: 8,
    borderColor: '#bbb',
  },
  addButton: {
    borderRadius: 10,
    backgroundColor: "#2ecc71",
    marginTop: 8,
    paddingVertical: 6,
    elevation: 2,
  },
});
