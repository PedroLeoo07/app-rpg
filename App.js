import React, { useState} from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [characters, setCharacters] = useState([
    { id: 1, name: "🧙‍♂️ Gandalf o Mago", recruited: false},
    { id: 2, name: "⚔️ Aragorn o Guerreiro", recruited: true},
    { id: 3, name: "🏹 Legolas o Arqueiro", recruited: false}
  ]);

  const [newCharacter, setNewCharacter] = useState("");

  function addCharacter() {
    const trimmedName = newCharacter.trim();
    if (trimmedName === "") {
      Alert.alert("Atenção", "Por favor, digite o nome do personagem.");
      return;
    }

    // Verificar se já existe um personagem com esse nome
    const existingChar = characters.find(char => 
      char.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingChar) {
      Alert.alert("Atenção", "Já existe um personagem com esse nome!");
      return;
    }

    const newId = Math.max(...characters.map(char => char.id), 0) + 1;
    const newCharacterObj = {
      id: newId,
      name: trimmedName,
      recruited: false
    };

    setCharacters([newCharacterObj, ...characters]);
    setNewCharacter("");
  }

  function toggleRecruit(character) {
    const updatedCharacters = characters.map(char =>
      char.id === character.id
        ? { ...char, recruited: !char.recruited }
        : char
    );
    setCharacters(updatedCharacters);
  }

  function removeCharacter(character) {
    Alert.alert(
      "Remover Personagem", 
      `Deseja remover ${character.name} da sua party?`, 
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            const filteredCharacters = characters.filter((char) => char.id !== character.id);
            setCharacters(filteredCharacters);
          }
        }
      ]
    );
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={[styles.character, item.recruited && styles.characterRecruited]}
        onPress={() => toggleRecruit(item)}
        onLongPress={() => removeCharacter(item)}
        activeOpacity={0.7}
      >
        <View style={styles.characterInfo}>
          <Text style={[styles.characterText, item.recruited && styles.characterRecruitedText]}>
            {item.name}
          </Text>
          <Text style={[styles.status, item.recruited && styles.statusRecruited]}>
            {item.recruited ? "✅ Recrutado" : "⏳ Disponível"}
          </Text>
        </View>
        <View style={styles.actionHint}>
          <Text style={styles.hintText}>Toque para recrutar</Text>
          <Text style={styles.hintText}>Mantenha para remover</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const recruitedCount = characters.filter(char => char.recruited).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>🎮 Minha Party RPG</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Party: {recruitedCount}/{characters.length} personagens
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do personagem"
          value={newCharacter}
          onChangeText={setNewCharacter}
          onSubmitEditing={addCharacter}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addCharacter}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum personagem na party</Text>
            <Text style={styles.emptySubtext}>Adicione alguns heróis!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2c3e50',
  },
  statsContainer: {
    backgroundColor: '#ecf0f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
    minWidth: 80,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  character: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#bdc3c7',
  },
  characterRecruited: {
    backgroundColor: '#e8f8f5',
    borderLeftColor: '#27ae60',
  },
  characterInfo: {
    flex: 1,
  },
  characterText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  characterRecruitedText: {
    color: '#27ae60',
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statusRecruited: {
    color: '#27ae60',
    fontWeight: '500',
  },
  actionHint: {
    alignItems: 'flex-end',
  },
  hintText: {
    fontSize: 10,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
  },
});