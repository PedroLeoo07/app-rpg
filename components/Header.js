import React from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Chip, Text } from "react-native-paper";

const Header = ({ total, recrutados, disponiveis }) => {
    return (
        <View style={styles.headerWrapper}>
            <Appbar.Header
                theme={{ colors: { primary: "#181a20" } }}
                style={styles.appbar}
                statusBarHeight={30}
            >
                <Appbar.Content
                    title={<Text style={styles.title}>👾 ADVENTURE PARTY ⚔️</Text>}
                />
            </Appbar.Header>

            <View style={styles.statsContainer}>
                <Chip icon="account-group" style={[styles.chip, styles.chipTotal]}>Total: {total}</Chip>
                <Chip icon="check" style={[styles.chip, styles.chipRecrutados]}>Recrutados: {recrutados}</Chip>
                <Chip icon="account-off-outline" style={[styles.chip, styles.chipDisponiveis]}>Disponíveis: {disponiveis}</Chip>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        backgroundColor: '#181a20',
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        overflow: 'hidden',
        marginBottom: 2,
        elevation: 8,
    },
    appbar: {
        elevation: 0,
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        color: "#fff",
        textShadowColor: '#000a',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
        letterSpacing: 1.2,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 14,
        backgroundColor: '#23242b',
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        gap: 8,
    },
    chip: {
        marginHorizontal: 2,
        paddingHorizontal: 8,
        height: 36,
        alignItems: 'center',
        borderRadius: 10,
        fontWeight: 'bold',
        fontSize: 15,
    },
    chipTotal: {
        backgroundColor: '#3b3b3b',
        color: '#fff',
    },
    chipRecrutados: {
        backgroundColor: '#cf1212',
        color: '#fff',
    },
    chipDisponiveis: {
        backgroundColor: '#48c019',
        color: '#fff',
    },
});

export default Header;