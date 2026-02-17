
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
    onRegister: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && birthDate.trim() && phone.trim()) {
            onRegister({ name, birthDate, phone });
        }
    };

    const isFormValid = name.trim() !== '' && birthDate.trim() !== '' && phone.trim().length >= 10;

    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Bem-vinda!</h2>
            <p className="text-center text-gray-500 mb-6">Vamos criar seu cadastro para agilizar seus agendamentos.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                    <input 
                        type="date" 
                        id="birthDate" 
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nº de WhatsApp</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        placeholder="(11) 99999-8888"
                        required
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Cadastrar e Acessar
                </button>
            </form>
        </div>
    );
};
