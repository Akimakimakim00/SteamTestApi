import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FriendsContext } from '../FriendsContext';

export const ProfileScreen = ({ onLogout }) => {
    const { setFriends } = useContext(FriendsContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiKey = await AsyncStorage.getItem('api_key');
                const steamId = await AsyncStorage.getItem('steam_id');

                const userResponse = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`);
                setUserData(userResponse.data.response.players[0]);

            } catch (error) {
                Alert.alert('Ошибка', 'Не удалось загрузить данные. Пожалуйста, проверьте API Key и Steam ID.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('api_key');
        await AsyncStorage.removeItem('steam_id');
        setUserData(null);
        setFriends([]);
        onLogout();
    };

    const getStatusMessage = (state) => {
        switch (state) {
            case 0:
                return 'Офлайн';
            case 1:
                return 'Онлайн';
            case 2:
                return 'Занят';
            case 3:
                return 'Не беспокоить';
            case 4:
                return 'В игре';
            case 5:
                return 'В ожидании';
            default:
                return 'Неизвестный статус';
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#ffffff" />;
    }

    return (
        <View style={styles.container}>
            {userData && (
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userData.personaname}</Text>
                    <Text style={styles.userStatus}>Статус: {getStatusMessage(userData.personastate)}</Text>
                    <Image source={{ uri: userData.avatar }} style={styles.avatar} />
                    <Button title="Выйти" onPress={handleLogout} color="#ff4d4d" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    userStatus: {
        fontSize: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
    },
});

export default ProfileScreen;
