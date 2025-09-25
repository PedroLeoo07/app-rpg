import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.icon}>⚔️</Text>
      <Text style={styles.text}>© {new Date().getFullYear()} Adventure Party RPG. Todos os direitos reservados.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#000',
    paddingVertical: 18,
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
    color: '#fff',
    opacity: 0.85,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: 'monospace',
  },
});

export default Footer;
