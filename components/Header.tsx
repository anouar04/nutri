
import React from 'react';
import { Page, User } from '../types';
import Button from './common/Button';

interface HeaderProps {
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentPage, setCurrentPage, onLogout }) => {
  const NavLink: React.FC<{ page: Page; children: React.ReactNode }> = ({ page, children }) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-2 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-primary text-white shadow-md'
            : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </button>
    );
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 4a1 1 0 000 2h6a1 1 0 100-2H7zM7 8a1 1 0 000 2h2a1 1 0 100-2H7z" clipRule="evenodd" />
              <path d="M12.586 12.586a2 2 0 012.828 0l.001.001a2 2 0 010 2.828l-5.001 5.001a2 2 0 01-2.828 0l-5-5a2 2 0 010-2.828l.001-.001a2 2 0 012.828 0L10 14.172l2.586-2.586z" />
            </svg>
            <h1 className="text-xl sm:text-2xl font-bold text-content ml-2">AI Nutritionist</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block" aria-label={`Welcome, ${user.name}`}>Welcome, {user.name.split(' ')[0]}!</span>
              <div className="flex items-center space-x-1 sm:space-x-2 bg-base-200 p-1 rounded-lg">
                <NavLink page={Page.Analyzer}>Analyzer</NavLink>
                <NavLink page={Page.Coach}>Coach</NavLink>
                <NavLink page={Page.History}>History</NavLink>
              </div>
              <Button onClick={onLogout} variant="secondary" className="!px-3 !py-2 !text-sm !shadow-none">
                Logout
              </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
