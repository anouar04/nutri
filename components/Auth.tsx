import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';
import type { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, this would be a secure backend call.
  // Here we simulate a user database with localStorage.
  const getUserDb = (): User[] => {
      const db = localStorage.getItem('user_db');
      return db ? JSON.parse(db) : [];
  }
  const setUserDb = (db: User[]) => {
      localStorage.setItem('user_db', JSON.stringify(db));
  }

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // This simulates a successful Google OAuth login with a delay.
    setTimeout(() => {
        const mockUser: User = { name: 'Demo User', email: 'demo@google.com' };
        onLogin(mockUser);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network delay for login/registration
    setTimeout(() => {
        if (isRegister) {
          // Registration Logic
          if (!name || !email || !password) {
            setError("Please fill all fields.");
            setIsLoading(false);
            return;
          }
          const db = getUserDb();
          if (db.some(user => user.email === email)) {
            setError("An account with this email already exists.");
            setIsLoading(false);
            return;
          }
          const newUser: User = { name, email };
          setUserDb([...db, newUser]);
          onLogin(newUser);
        } else {
          // Login Logic
          if (!email || !password) {
            setError("Please enter email and password.");
            setIsLoading(false);
            return;
          }
           const db = getUserDb();
           const user = db.find(user => user.email === email);
           if (user) {
               // In a real app, you would verify the password hash. Here we just check for existence.
               onLogin(user);
           } else {
               setError("No account found with that email. Please register.");
               setIsLoading(false);
           }
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 4a1 1 0 000 2h6a1 1 0 100-2H7zM7 8a1 1 0 000 2h2a1 1 0 100-2H7z" clipRule="evenodd" />
                  <path d="M12.586 12.586a2 2 0 012.828 0l.001.001a2 2 0 010 2.828l-5.001 5.001a2 2 0 01-2.828 0l-5-5a2 2 0 010-2.828l.001-.001a2 2 0 012.828 0L10 14.172l2.586-2.586z" />
                </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-content mb-2">{isRegister ? 'Create Your Account' : 'Welcome Back!'}</h1>
            <p className="text-gray-600">{isRegister ? 'Join to start your health journey.' : 'Sign in to continue.'}</p>
        </div>

        <div className="space-y-4">
            <Button onClick={handleGoogleLogin} variant="secondary" className="w-full" disabled={isLoading}>
                <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 74.2C313.6 113.4 283.7 96 248 96c-84.3 0-152.3 67.8-152.3 152s68 152 152.3 152c92.8 0 135-61.2 142.8-92.2h-142.8v-95.9h244.3c1.3 12.8 2.2 26.6 2.2 40.8z"></path></svg>
                Sign in with Google
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && <Input label="Name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required disabled={isLoading} />}
                <Input label="Email Address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required disabled={isLoading} />
                <Input label="Password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required disabled={isLoading} />
                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Spinner /> : (isRegister ? 'Register' : 'Login')}
                </Button>
            </form>

            <p className="text-sm text-center text-gray-600">
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <button 
                  onClick={() => { if (!isLoading) { setIsRegister(!isRegister); setError(null); }}} 
                  className="font-medium text-primary hover:text-primary-focus focus:outline-none focus:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                    {isRegister ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
