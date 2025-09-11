import React, { useState, useMemo } from "react";
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
    { id: 1, name: "🧙‍♂️ Gandalf o Mago", recruited: false, category: "Mago", level: 85 },
    { id: 2, name: "⚔️ Aragorn o Guerreiro", recruited: true, category: "Guerreiro", level: 72 },
    { id: 3, name: "🏹 Legolas o Arqueiro", recruited: false, category: "Arqueiro", level: 68 }
  ]);

  const [newCharacter, setNewCharacter] = useState("");
  const [newCategory, setNewCategory] = useState("Guerreiro");
  const [filter, setFilter] = useState("todos"); // todos, recrutados, disponíveis
  const [sortBy, setSortBy] = useState("name"); // name, level, category

  const categories = ["Guerreiro", "Mago", "Arqueiro", "Clérigo", "Ladino"];

  // Filtrar e ordenar personagens
  const filteredAndSortedCharacters = useMemo(() => {
    let filtered = characters;
    
    // Aplicar filtro
    if (filter === "recrutados") {
      filtered = characters.filter(char => char.recruited);
    } else if (filter === "disponíveis") {
      filtered = characters.filter(char => !char.recruited);
    }
    
    // Aplicar ordenação
    return filtered.sort((a, b) => {
      if (sortBy === "level") return b.level - a.level;
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
  }, [characters, filter, sortBy]);

  function addCharacter() {
    const trimmedName = newCharacter.trim();
    if (trimmedName === "") {
      Alert.alert("Atenção", "Por favor, digite o nome do personagem.");
      return;
    }

    const existingChar = characters.find(char => 
      char.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingChar) {
      Alert.alert("Atenção", "Já existe um personagem com esse nome!");
      return;
    }

    const newId = Math.max(...characters.map(char => char.id), 0) + 1;
    const randomLevel = Math.floor(Math.random() * 50) + 20; // Level entre 20-70
    
    const newCharacterObj = {
      id: newId,
      name: trimmedName,
      recruited: false,
      category: newCategory,
      level: randomLevel
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
          <View style={styles.characterDetails}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.levelText}>Nível {item.level}</Text>
          </View>
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
  const averageLevel = characters.length > 0 ? 
    Math.round(characters.reduce((sum, char) => sum + char.level, 0) / characters.length) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>🎮 Minha Party RPG</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Party: {recruitedCount}/{characters.length} personagens
        </Text>
        <Text style={styles.statsSubtext}>
          Nível médio: {averageLevel}
        </Text>
      </View>

      {/* Filtros e Ordenação */}
      <View style={styles.controlsContainer}>
        <View style={styles.filtersRow}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === "todos" && styles.filterButtonActive]}
            onPress={() => setFilter("todos")}
          >
            <Text style={[styles.filterText, filter === "todos" && styles.filterTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === "recrutados" && styles.filterButtonActive]}
            onPress={() => setFilter("recrutados")}
          >
            <Text style={[styles.filterText, filter === "recrutados" && styles.filterTextActive]}>
              Recrutados
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === "disponíveis" && styles.filterButtonActive]}
            onPress={() => setFilter("disponíveis")}
          >
            <Text style={[styles.filterText, filter === "disponíveis" && styles.filterTextActive]}>
              Disponíveis
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === "name" && styles.sortButtonActive]}
            onPress={() => setSortBy("name")}
          >
            <Text style={styles.sortText}>Nome</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === "level" && styles.sortButtonActive]}
            onPress={() => setSortBy("level")}
          >
            <Text style={styles.sortText}>Nível</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === "category" && styles.sortButtonActive]}
            onPress={() => setSortBy("category")}
          >
            <Text style={styles.sortText}>Classe</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nome do personagem"
            value={newCharacter}
            onChangeText={setNewCharacter}
            onSubmitEditing={addCharacter}
            returnKeyType="done"
          />
          <View style={styles.categorySelector}>
            <Text style={styles.categoryLabel}>Classe:</Text>
            <View style={styles.categoryButtons}>
              {categories.slice(0, 3).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, newCategory === cat && styles.categoryButtonActive]}
                  onPress={() => setNewCategory(cat)}
                >
                  <Text style={[styles.categoryButtonText, newCategory === cat && styles.categoryButtonTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addCharacter}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAndSortedCharacters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filter === "todos" ? "Nenhum personagem na party" : 
               filter === "recrutados" ? "Nenhum personagem recrutado" :
               "Nenhum personagem disponível"}
            </Text>
            <Text style={styles.emptySubtext}>
              {filter === "todos" ? "Adicione alguns heróis!" : "Tente outro filtro!"}
            </Text>
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
  statsSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
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
  controlsContainer: {
    marginBottom: 15,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterText: {
    fontSize: 12,
    color: '#34495e',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 10,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  sortButtonActive: {
    backgroundColor: '#e74c3c',
  },
  sortText: {
    fontSize: 11,
    color: '#34495e',
  },
  inputRow: {
    flex: 1,
  },
  categorySelector: {
    marginTop: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#9b59b6',
  },
  categoryButtonText: {
    fontSize: 10,
    color: '#34495e',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  characterDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  categoryText: {
    fontSize: 11,
    color: '#9b59b6',
    fontWeight: '600',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 11,
    color: '#e67e22',
    fontWeight: '600',
  },
});