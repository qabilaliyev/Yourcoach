import React, { createContext, useReducer, useState } from "react";


export const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

    const [cal, setCal] = useState()
    return (
        <GlobalContext.Provider value={{
            cal, setCal
        }}>
            {children}
        </GlobalContext.Provider>
    );
};