// components/CharacterCard.js
import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

export default function CharacterCard({ item, onToggleRecruit, onRemove, categoryConfig }) {
  const config = categoryConfig?.[item.category] ?? { icon: "❓", color: "#333", bgColor: "#fff" };
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}> 
      <TouchableOpacity
        activeOpacity={0.93}
        onPress={() => { animatePress(); onToggleRecruit(item); }}
        onLongPress={() => onRemove(item)}
        style={[
          styles.card,
          { backgroundColor: config.bgColor, borderLeftColor: config.color },
          item.recruited && styles.cardRecruited,
          item.recruited && { shadowColor: config.color, shadowOpacity: 0.25, shadowRadius: 8, borderLeftWidth: 8 }
        ]}
      >
        <View style={styles.left}>
          <View style={[styles.avatar, { backgroundColor: config.color + '22' }]}> 
            <Text style={styles.icon}>{config.icon}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.meta}>{item.category} • Nível {item.level}</Text>
          {item.recruited && (
            <Text style={styles.recruitedLabel}>Recrutado</Text>
          )}
        </View>

        <View style={styles.actions}>
          <IconButton
            icon={item.recruited ? "account-check" : "account-plus"}
            size={22}
            style={styles.actionBtn}
            onPress={() => onToggleRecruit(item)}
            iconColor={item.recruited ? config.color : '#727272'}
          />
          <IconButton
            icon="delete"
            size={22}
            style={styles.actionBtn}
            onPress={() => onRemove(item)}
            iconColor="#cf1212"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 2,
  },
  cardRecruited: {
    opacity: 1,
    backgroundColor: '#f0fff0',
    borderLeftColor: '#48c019',
  },
  left: {
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  icon: { fontSize: 24 },
  body: { flex: 1 },
  name: { fontSize: 17, fontWeight: "bold", color: '#222' },
  meta: { fontSize: 13, color: "#666", marginTop: 2 },
  recruitedLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#48c019',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  actions: { flexDirection: "row", alignItems: "center", marginLeft: 6 },
  actionBtn: { margin: 0, padding: 0 },
});
