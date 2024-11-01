import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthScreen } from './screens/AuthScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { FriendsList } from "./screens/FriendsList";
import { FriendsProvider } from './FriendsContext';

const Tab = createBottomTabNavigator();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <FriendsProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: '#ff4d4d',
                        tabBarInactiveTintColor: '#666666',
                        tabBarStyle: { display: 'none' },
                    }}
                >
                    {!isAuthenticated ? (
                        <Tab.Screen name='AuthScreen'>
                            {props => <AuthScreen {...props} onLogin={handleLogin} />}
                        </Tab.Screen>
                    ) : (
                        <>
                            <Tab.Screen name='ProfileScreen'>
                                {props => <ProfileScreen {...props} onLogout={handleLogout} />}
                            </Tab.Screen>
                            <Tab.Screen name='FriendList' component={FriendsList} />
                        </>
                    )}
                </Tab.Navigator>
            </NavigationContainer>
        </FriendsProvider>
    );
};

export default App;
