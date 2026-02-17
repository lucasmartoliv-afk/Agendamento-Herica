
import React, { useMemo } from 'react';
import { Service } from '../types';
import { STUDIO_WHATSAPP_NUMBER } from '../constants';

interface SuccessProps {
    services: Service[];
    date: Date;
    time: string;
    onReset: () => void;
}

export const Success: React.FC<SuccessProps> = ({ services, date, time, onReset }) => {
    
    const totalPrice = useMemo(() => services.reduce((acc, s) => acc + s.price, 0), [services]);

    const handleWhatsAppConfirm = () => {
        const serviceList = services.map(s => `- ${s.name}`).join('\n');
        const formattedDate = date.toLocaleDateString('pt-BR');
        const formattedPrice = `R$${totalPrice.toFixed(2).replace('.', ',')}`;

        const message = `Olá Hérica, tudo bem? ✨\n\nAcabei de agendar meu horário pelo aplicativo e gostaria de confirmar os detalhes para o nosso encontro de beleza:\n\n*Meus mimos escolhidos:*\n${serviceList}\n\n*Data:* ${formattedDate}\n*Horário:* ${time}\n*Valor Total:* ${formattedPrice}\n\nEstou super animada! Obrigada e até lá! 💕`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${STUDIO_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    return (
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg animate-fade-in">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Tudo Certo!</h2>
            <p className="text-gray-600 mt-2">Seu horário foi pré-agendado. Para garantir sua vaga, envie uma mensagem para confirmar.</p>
            
            <button 
                onClick={handleWhatsAppConfirm}
                className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.94 8.94 0 01-4.364-1.221L2.26 17.539l1.78-3.965A8.963 8.963 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7.887 6.464a.5.5 0 00-.435.252L6.12 9.47a.5.5 0 00.063.593l1.83 2.439a.5.5 0 00.594.133l1.748-.874a.5.5 0 00.252-.435l-.748-3.047a.5.5 0 00-.52-.415h-1.45z" clipRule="evenodd" /></svg>
                Confirmar via WhatsApp
            </button>
            
            <button onClick={onReset} className="mt-8 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                Agendar Novo Serviço
            </button>
        </div>
    )
}
