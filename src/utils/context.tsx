import React, { createContext, useContext } from 'react';

const RootContext = createContext<HTMLElement | null>(null);

export const useContainer = () => {
    return useContext(RootContext)
}

type ContextProps = {
    value: HTMLElement | null
    children: React.ReactNode
}

const Context = ({ children, value }: ContextProps) => {
    return (
        <RootContext.Provider value={value}>
            {children}
        </RootContext.Provider>
    )
}

export default Context;