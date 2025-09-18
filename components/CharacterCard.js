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
        activeOpacity={0.9}
        onPress={() => { animatePress(); onToggleRecruit(item); }}
        onLongPress={() => onRemove(item)}
        style={[
          styles.card,
          { backgroundColor: config.bgColor, borderLeftColor: config.color },
          item.recruited && styles.cardRecruited
        ]}
      >
        <View style={styles.left}>
          <Text style={styles.icon}>{config.icon}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.meta}>{item.category} • Nível {item.level}</Text>
        </View>

        <View style={styles.actions}>
          <IconButton
            icon={item.recruited ? "account-check" : "account-plus"}
            size={20}
            onPress={() => onToggleRecruit(item)}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onRemove(item)}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 6,
    elevation: 1
  },
  cardRecruited: {
    opacity: 0.9
  },
  left: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  icon: { fontSize: 20 },
  body: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700" },
  meta: { fontSize: 12, color: "#666", marginTop: 2 },
  actions: { flexDirection: "row", alignItems: "center" }
});
