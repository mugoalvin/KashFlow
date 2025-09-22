import { createContext, useContext } from 'react';

type ThemeContextType = {
	resetTheme: () => void;
	updateTheme: (color: string) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function useThemeContext() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error('useThemeContext must be used within ThemeProvider');
	return context;
};