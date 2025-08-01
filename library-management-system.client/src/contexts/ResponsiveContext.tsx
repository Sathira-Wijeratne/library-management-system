import { useMediaQuery, useTheme } from '@mui/material';
import React, { createContext, useContext } from 'react';

// Interface for context type
interface ResponsiveContextType {
    isMobile: boolean;
}

// Props interface for the ResponsiveProvider component
interface ResponsiveProviderProps {
    children: React.ReactNode;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export function ResponsiveProvider({ children }: ResponsiveProviderProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        // ResponsiveContext.Provider broadcasts the isMobile state
        <ResponsiveContext.Provider value={{ isMobile }}>
            {children}
        </ResponsiveContext.Provider>
    );
};

// custom hook to access the ResponsiveContext
export const useResponsive = (): ResponsiveContextType => {
    const context = useContext(ResponsiveContext);
    if (context === undefined) {
        throw new Error('useResponsive must be used within a ResponsiveProvider');
    }
    return context;
};
