import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    colors: {
      // Light theme colors (default)
      background: '#F7F5EC',
      cardBackground: '#FFFFFF',
      text: '#021229',
      textSecondary: '#6E6D7A',
      border: '#E7E8EC',
      primary: '#119C21',
      primaryLight: '#D8F7D7',
      primaryDark: '#416B40',
      accent: '#4e6aff',
      error: '#FF3B30',
      success: '#119C21',
      warning: '#FF9500',
      // Dark theme colors
      darkBackground: '#121212',
      darkCardBackground: '#1E1E1E',
      darkText: '#FFFFFF',
      darkTextSecondary: '#B0B0B0',
      darkBorder: '#333333',
    },
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};