import React, { useState, useEffect } from 'react';
import './App.css';
import GitHubUsers from './components/GitHubUsers';
import CountriesList from './components/CountriesList';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      <header className="App-header">
        <h1>Countries Explorer</h1>
      </header>
      <main>
        <CountriesList />
      </main>
    </div>
  );
}

export default App;
