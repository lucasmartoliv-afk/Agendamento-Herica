
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                Studio <span className="text-pink-500">Hérica Bitencurth</span>
            </h1>
            <p className="text-lg text-gray-500 mt-2">Seu agendamento de beleza, simples e rápido.</p>
        </header>
    );
};
