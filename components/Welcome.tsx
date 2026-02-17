
import React, { useMemo } from 'react';
import { User } from '../types';

interface WelcomeProps {
    user: User;
    onStartBooking: () => void;
}

const motivationalQuotes = [
    "A beleza começa no momento em que você decide ser você mesma.",
    "Cuide de si mesma. Você é a pessoa mais importante da sua vida.",
    "Acredite na sua beleza, ela é única e poderosa.",
    "Tire um tempo para fazer sua alma feliz.",
    "Invista em você. A vida fica mais bonita quando você se ama."
];

export const Welcome: React.FC<WelcomeProps> = ({ user, onStartBooking }) => {
    const quote = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        return motivationalQuotes[randomIndex];
    }, []);
    
    const firstName = user.name.split(' ')[0];

    return (
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800">Olá, <span className="text-pink-500">{firstName}</span>!</h2>
            <p className="text-gray-600 mt-2 text-lg">É um prazer ter você aqui no Studio Hérica Bitencurth.</p>

            <div className="my-8 p-4 bg-pink-50 border-l-4 border-pink-400">
                <p className="text-gray-700 italic">"{quote}"</p>
            </div>
            
            <button 
                onClick={onStartBooking}
                className="w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
                Fazer Novo Agendamento
            </button>
        </div>
    );
};
