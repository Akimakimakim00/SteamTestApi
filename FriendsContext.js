import React, { createContext, useState } from 'react';

export const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);

    return (
        <FriendsContext.Provider value={{ friends, setFriends }}>
            {children}
        </FriendsContext.Provider>
    );
};
