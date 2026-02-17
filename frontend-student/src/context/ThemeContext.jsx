import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('cc_theme') || 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const body = window.document.body;

        console.log('Theme changing to:', theme);

        if (theme === 'dark') {
            root.classList.add('dark');
            // Ensure body doesn't have it to avoid duplicates/confusion, 
            // though tailwind looks up the tree so it would work on body too.
            // We standardize on root (html).
            body.classList.remove('dark');
            console.log('Added dark class to HTML.');
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark'); // Aggressively remove from body too

            // Hard cleanup just in case
            if (root.classList.contains('dark')) root.classList.remove('dark');
            if (body.classList.contains('dark')) body.classList.remove('dark');

            console.log('Removed dark class from HTML & BODY.');
            console.log('HTML Classes:', root.classList.value);
            console.log('Body Classes:', body.classList.value);
        }
        localStorage.setItem('cc_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
