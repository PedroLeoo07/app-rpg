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
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
    
    if (filter === "recrutados") {
      filtered = characters.filter(char => char.recruited);
    } else if (filter === "disponíveis") {
      filtered = characters.filter(char => !char.recruited);
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === "level") return b.level - a.level;
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
  }, [characters, filter, sortBy]);

  function addCharacter() {
    const trimmedName = newCharacter.trim();
    if (trimmedName === "") {
      Alert.alert("⚠️ Atenção", "Por favor, digite o nome do personagem.");
      return;
    }

    const existingChar = characters.find(char => 
      char.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingChar) {
      Alert.alert("⚠️ Atenção", "Já existe um personagem com esse nome!");
      return;
    }

    const newId = Math.max(...characters.map(char => char.id), 0) + 1;
    const randomLevel = Math.floor(Math.random() * 50) + 20;
    
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
    const config = categoryConfig[item.category];
    const scaleAnim = new Animated.Value(1);
    
    const animatePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
      ]).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.character,
            { backgroundColor: config.bgColor, borderLeftColor: config.color },
            item.recruited && styles.characterRecruited
          ]}
          onPress={() => {
            animatePress();
            toggleRecruit(item);
          }}
          onLongPress={() => removeCharacter(item)}
          activeOpacity={0.8}
        >
          <View style={styles.characterIcon}>
            <Text style={styles.categoryIcon}>{config.icon}</Text>
          </View>
          
          <View style={styles.characterInfo}>
            <Text style={[styles.characterText, item.recruited && styles.characterRecruitedText]}>
              {item.name}
            </Text>
            <View style={styles.characterDetails}>
              <View style={[styles.categoryBadge, { backgroundColor: config.color }]}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>⭐ {item.level}</Text>
              </View>
            </View>
            <Text style={[styles.status, item.recruited && styles.statusRecruited]}>
              {item.recruited ? "✅ Na Party" : "⏳ Disponível"}
            </Text>
          </View>
          
          <View style={styles.recruitButton}>
            <View style={[
              styles.recruitIndicator,
              { backgroundColor: item.recruited ? '#27ae60' : '#95a5a6' }
            ]}>
              <Text style={styles.recruitIcon}>
                {item.recruited ? '👥' : '➕'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const recruitedCount = characters.filter(char => char.recruited).length;
  const averageLevel = characters.length > 0 ? 
    Math.round(characters.reduce((sum, char) => sum + char.level, 0) / characters.length) : 0;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>⚔️ ADVENTURE PARTY ⚔️</Text>
        <Text style={styles.subtitle}>Construa sua party épica!</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{recruitedCount}</Text>
            <Text style={styles.statLabel}>Heróis</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{characters.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{averageLevel}</Text>
            <Text style={styles.statLabel}>Nível Médio</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.controlsContainer}>
          <View style={styles.filtersRow}>
            {['todos', 'recrutados', 'disponíveis'].map(filterOption => (
              <TouchableOpacity
                key={filterOption}
                style={[styles.filterButton, filter === filterOption && styles.filterButtonActive]}
                onPress={() => setFilter(filterOption)}
              >
                <Text style={[styles.filterText, filter === filterOption && styles.filterTextActive]}>
                  {filterOption === 'todos' ? '🌟 Todos' : 
                   filterOption === 'recrutados' ? '👥 Party' : '⏳ Livres'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Ordenar:</Text>
            {[
              { key: 'name', label: '📝 Nome', icon: '📝' },
              { key: 'level', label: '⭐ Nível', icon: '⭐' },
              { key: 'category', label: '🎭 Classe', icon: '🎭' }
            ].map(sortOption => (
              <TouchableOpacity
                key={sortOption.key}
                style={[styles.sortButton, sortBy === sortOption.key && styles.sortButtonActive]}
                onPress={() => setSortBy(sortOption.key)}
              >
                <Text style={[styles.sortText, sortBy === sortOption.key && styles.sortTextActive]}>
                  {sortOption.icon}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>🆕 Recrutar Novo Herói</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Nome do herói..."
                placeholderTextColor="#95a5a6"
                value={newCharacter}
                onChangeText={setNewCharacter}
                onSubmitEditing={addCharacter}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addButton} onPress={addCharacter}>
                <LinearGradient
                  colors={['#56ab2f', '#a8e6cf']}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonText}>➕</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            <View style={styles.categorySelector}>
              <Text style={styles.categoryLabel}>🎭 Escolha a Classe:</Text>
              <View style={styles.categoryButtons}>
                {categories.map(cat => {
                  const config = categoryConfig[cat];
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        { borderColor: config.color },
                        newCategory === cat && { backgroundColor: config.color }
                      ]}
                      onPress={() => setNewCategory(cat)}
                    >
                      <Text style={styles.categoryIcon}>{config.icon}</Text>
                      <Text style={[
                        styles.categoryButtonText,
                        newCategory === cat && styles.categoryButtonTextActive
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            {filter === 'todos' ? '🌟 Todos os Heróis' :
             filter === 'recrutados' ? '👥 Minha Party' : '⏳ Heróis Disponíveis'}
          </Text>
          
          <FlatList
            data={filteredAndSortedCharacters}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🏴‍☠️</Text>
                <Text style={styles.emptyText}>
                  {filter === "todos" ? "Nenhum herói encontrado" : 
                   filter === "recrutados" ? "Sua party está vazia" :
                   "Nenhum herói disponível"}
                </Text>
                <Text style={styles.emptySubtext}>
                  {filter === "todos" ? "Recrute alguns aventureiros!" : "Tente outro filtro!"}
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#e8e8e8',
    marginTop: 5,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: '#e8e8e8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  controlsContainer: {
    marginBottom: 20,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
  },
  filterText: {
    fontSize: 12,
    color: '#34495e',
    fontWeight: '600',
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
    marginRight: 15,
    fontWeight: '600',
  },
  sortButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  sortButtonActive: {
    backgroundColor: '#e74c3c',
  },
  sortText: {
    fontSize: 16,
  },
  sortTextActive: {
    fontSize: 16,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ecf0f1',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
    color: '#2c3e50',
  },
  addButton: {
    marginLeft: 10,
  },
  addButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  categorySelector: {
    marginTop: 5,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 10,
    fontWeight: '600',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: (width - 80) / 3,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  categoryIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  categoryButtonText: {
    fontSize: 10,
    color: '#34495e',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  listSection: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  character: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderLeftWidth: 5,
  },
  characterRecruited: {
    backgroundColor: '#f0fff4',
    borderLeftColor: '#27ae60',
  },
  characterIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  characterText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 6,
    fontWeight: '600',
  },
  characterRecruitedText: {
    color: '#27ae60',
  },
  characterDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 11,
    color: '#856404',
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statusRecruited: {
    color: '#27ae60',
  },
  recruitButton: {
    marginLeft: 10,
  },
  recruitIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recruitIcon: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});