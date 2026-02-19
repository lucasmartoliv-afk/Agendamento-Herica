import React, { useState } from 'react';
import { LockClosedIcon } from './icons';
import { getAdminPassword } from '../utils/adminUtils';

interface AdminLoginProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginAttempt = () => {
        const enteredPassword = password.trim();
        const correctPassword = getAdminPassword();

        if (enteredPassword === correctPassword) {
            onSuccess();
        } else {
            setError('Senha incorreta. Tente novamente.');
            setPassword('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLoginAttempt();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-pink-100">
                       <LockClosedIcon />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Acesso Restrito</h2>
                    <p className="mt-2 text-gray-500">Por favor, insira a senha para ver a agenda.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if(error) setError('');
                            }}
                            className={`w-full px-4 py-3 text-center border rounded-lg focus:outline-none focus:ring-2 ${
                                error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'
                            }`}
                            placeholder="••••••••"
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                    <button
                        type="submit"
                        className="mt-4 w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300"
                        disabled={!password}
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};