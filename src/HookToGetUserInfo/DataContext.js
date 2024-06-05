import React, { createContext, useState, useContext } from 'react';
const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const updateUserData = (newData) => {
        setUserData(newData);
    };
    return (
        <DataContext.Provider value={{ userData, updateUserData }}>
            {children}
        </DataContext.Provider>
    );
};
