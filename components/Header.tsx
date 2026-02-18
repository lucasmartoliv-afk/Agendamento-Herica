
import React from 'react';
import { CalendarDaysIcon } from './icons';

interface HeaderProps {
    onGoToAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoToAdmin }) => {
    return (
        <header className="w-full max-w-2xl mx-auto text-center relative">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                Studio <span className="text-pink-500">Hérica Bitencurth</span>
            </h1>
            <p className="text-lg text-gray-500 mt-2">Seu agendamento de beleza, simples e rápido.</p>
            <button
                onClick={onGoToAdmin}
                className="absolute top-0 right-0 p-2 text-gray-500 hover:text-pink-500 transition-colors"
                aria-label="Ver agenda"
            >
                <CalendarDaysIcon />
            </button>
        </header>
    );
};
