import React from 'react';

export default function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="theme-toggle"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}
