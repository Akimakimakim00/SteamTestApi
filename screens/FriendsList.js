import React, { useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FriendsContext } from '../FriendsContext';

export const FriendsList = ({ navigation }) => {
    const { friends, setFriends } = useContext(FriendsContext);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiKey = await AsyncStorage.getItem('api_key');
                const steamId = await AsyncStorage.getItem('steam_id');

                const friendsResponse = await axios.get(`https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${steamId}&relationship=friend`);
                const friendsList = friendsResponse.data.friendslist.friends;

                const friendsData = await Promise.all(friendsList.map(async (friend) => {
                    const friendResponse = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${friend.steamid}`);
                    return { ...friend, ...friendResponse.data.response.players[0] };
                }));

                friendsData.sort((a, b) => b.friend_since - a.friend_since);

                setFriends(friendsData);
            } catch (error) {
                Alert.alert('Ошибка', 'Не удалось загрузить данные. Пожалуйста, проверьте API Key и Steam ID.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigation, setFriends]);

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
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="black" />
                </View>
            );
        }

    return (
        <View style={styles.container}>
            <FlatList
                data={friends}
                keyExtractor={(item) => item.steamid}
                renderItem={({ item }) => (
                    <View style={styles.friendItem}>
                        <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
                        <View>
                            <Text style={styles.friendName}>{item.personaname}</Text>
                            <Text style={styles.friendSteamId}>Steam ID: {item.steamid}</Text>
                            <Text style={styles.friendDate}>Дата добавления: {new Date(item.friend_since * 1000).toLocaleDateString()}</Text>
                            <Text style={styles.friendStatus}>Статус: {getStatusMessage(item.personastate)}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#b8b8b8',
        borderRadius: 15,
    },
    friendAvatar: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FriendsList;
