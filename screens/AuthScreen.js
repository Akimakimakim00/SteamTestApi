import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export const AuthScreen = ({ onLogin }) => {
    const [apiKey, setApiKey] = useState('');
    const [steamId, setSteamId] = useState('');

    const handleLogin = async () => {
        if (apiKey && steamId) {
            await AsyncStorage.setItem('api_key', apiKey);
            await AsyncStorage.setItem('steam_id', steamId);
            setApiKey('');
            setSteamId('');
            onLogin();
        } else {
            Alert.alert('Ошибка', 'Пожалуйста, введите API Key и Steam ID');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="API Key"
                value={apiKey}
                onChangeText={setApiKey}
                placeholderTextColor="#666666" // Цвет текста подсказки
            />
            <TextInput
                style={styles.input}
                placeholder="Steam ID"
                value={steamId}
                onChangeText={setSteamId}
                placeholderTextColor="#666666" // Цвет текста подсказки
            />
            <Button title="Войти" onPress={handleLogin} color="#ff4d4d" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff', // Белый фон
        justifyContent: 'center',
    },
    input: {
        height: 50,
        borderColor: '#666666', // Цвет рамки
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#000000', // Черный текст
        backgroundColor: '#f0f0f0', // Светлый фон для полей ввода
    },
});

export default AuthScreen;
