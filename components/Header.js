import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Chip, Text } from "react-native-paper";

const Header = ({ total, recrutados, disponiveis }) => {
    return (
        <View>
            <Appbar.Header
                theme={{ colors: { primary: "#e6e6e6ff" } }}
                style={styles.appbar}
                statusBarHeight={30}
            >
                <Appbar.Content
                    title="👾 ADVENTURE PARTY ⚔️"
                    titleStyle={styles.title}
                />
            </Appbar.Header>

            <View style={styles.statsContainer}>
                <Chip icon="account-group">Total: {total}</Chip>
                <Chip icon="check" style={{ backgroundColor: '#cf1212ff' }}>Recrutados: {recrutados}</Chip>
                <Chip icon="account-off-outline" style={{ backgroundColor: '#48c019ff' }}>Disponíveis: {disponiveis}</Chip>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    appbar: {
        elevation: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#414141ff',
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        color: "#000000ff",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        backgroundColor: '#727272ff',
        borderBottomWidth: 1,
        borderBottomColor: '#414141ff'
    },
});

export default Header;