
import React from 'react';
import { User } from '../types';

interface BirthdayWishProps {
    user: User;
    onContinue: () => void;
}

export const BirthdayWish: React.FC<BirthdayWishProps> = ({ user, onContinue }) => {
    const firstName = user.name.split(' ')[0];

    return (
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg animate-fade-in relative overflow-hidden">
            <div className="absolute -top-4 -left-4 w-16 h-16 text-yellow-300 opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15.59L4.41 18.27l1.3-6.21L1 7.46l6.3-.54L10 1l2.7 5.92 6.3.54-4.71 4.6 1.3 6.21L10 15.59z"/></svg>
            </div>
             <div className="absolute -bottom-4 -right-4 w-16 h-16 text-yellow-300 opacity-50 transform rotate-45">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15.59L4.41 18.27l1.3-6.21L1 7.46l6.3-.54L10 1l2.7 5.92 6.3.54-4.71 4.6 1.3 6.21L10 15.59z"/></svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">Feliz Aniversário, <span className="text-pink-500">{firstName}</span>!</h2>
            <p className="text-gray-600 mt-4 text-lg max-w-md mx-auto">
                Este é o seu mês! Que seu dia seja tão maravilhoso quanto você e que este novo ciclo traga ainda mais beleza, alegria e momentos especiais.
                Você merece todo o carinho do mundo!
            </p>

            <p className="mt-6 font-semibold text-pink-600">Comemore em grande estilo!</p>
            
            <button 
                onClick={onContinue}
                className="mt-4 w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
                Agendar meu presente de beleza
            </button>
        </div>
    );
};
