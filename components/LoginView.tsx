
import React, { useState } from 'react';
import Icon from './Icon';

interface LoginViewProps {
    onLogin: (username: string) => void;
    isConnecting: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, isConnecting }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && !isConnecting) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="h-screen w-screen bg-base-100 flex items-center justify-center">
            <div className="w-full max-w-sm p-8 bg-base-200 rounded-lg shadow-2xl text-center">
                <Icon name="plane" className="w-16 h-16 mx-auto text-brand-blue mb-4" />
                <h1 className="text-2xl font-bold text-base-content mb-2">Airport Simulator Pro</h1>
                <p className="text-base-content-secondary mb-6">Enter your name to go online.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                        className="w-full bg-base-100 border border-base-300 rounded-md px-3 py-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        required
                        disabled={isConnecting}
                    />
                    <button
                        type="submit"
                        disabled={!username.trim() || isConnecting}
                        className="w-full mt-4 bg-brand-blue text-white font-bold py-3 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-wait"
                    >
                        {isConnecting ? 'Connecting...' : 'Go Online'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginView;