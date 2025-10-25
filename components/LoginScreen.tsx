
import React from 'react';
import { LogoIcon } from './IconComponents';

interface LoginScreenProps {
  onLogin: () => void;
  onShowTerms: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onShowTerms }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 animate-fade-in">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
                 <LogoIcon className="w-12 h-12 text-primary" />
                 <h1 className="text-4xl font-bold text-dark">Jai Uttrakhand</h1>
            </div>
          <p className="text-slate-500">Welcome! Please log in to access the creative suite.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue="demo@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Log in
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
                By logging in, you agree to our{' '}
                <button onClick={onShowTerms} className="font-medium text-primary hover:text-primary-dark underline">
                    Terms and Conditions
                </button>
                .
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
