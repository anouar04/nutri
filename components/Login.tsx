
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <Card className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 4a1 1 0 000 2h6a1 1 0 100-2H7zM7 8a1 1 0 000 2h2a1 1 0 100-2H7z" clipRule="evenodd" />
              <path d="M12.586 12.586a2 2 0 012.828 0l.001.001a2 2 0 010 2.828l-5.001 5.001a2 2 0 01-2.828 0l-5-5a2 2 0 010-2.828l.001-.001a2 2 0 012.828 0L10 14.172l2.586-2.586z" />
            </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-content mb-2">Welcome to AI Nutritionist</h1>
        <p className="text-gray-600 mb-8">Your personal AI-powered health coach.</p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            In a real-world application, you would sign in with your email or social account. 
            For this demonstration, you can proceed as a demo user.
          </p>
          <Button onClick={onLogin} className="w-full">
            Login as Demo User
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
