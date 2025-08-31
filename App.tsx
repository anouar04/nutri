
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import MealAnalyzer from './components/MealAnalyzer';
import PersonalCoach from './components/PersonalCoach';
import History from './components/History';
import Auth from './components/Auth';
import { Page, User } from './types';
import { clearHistory } from './services/apiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Analyzer);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    }
  }, []);


  const renderPage = useCallback(() => {
    switch (currentPage) {
      case Page.Analyzer:
        return <MealAnalyzer />;
      case Page.Coach:
        return <PersonalCoach />;
      case Page.History:
        return <History />;
      default:
        return <MealAnalyzer />;
    }
  }, [currentPage]);
  
  const handleLogin = (newUser: User) => {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
  };
  
  const handleLogout = async () => {
      localStorage.removeItem('user');
      setUser(null);
      setCurrentPage(Page.Analyzer);
      // Simulate clearing user-specific data on logout
      await clearHistory();
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-base-100 text-content font-sans">
      <Header user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Powered by AI. Nutritional information is an estimate and should not be considered medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
