
import React, { useState, useMemo } from 'react';
import { Service, User } from '../types';

interface ConfirmationProps {
  user: User;
  services: Service[];
  date: Date;
  time: string;
  onConfirm: () => void;
  onBack: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ user, services, date, time, onConfirm, onBack }) => {
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone);

    const totalPrice = useMemo(() => services.reduce((acc, s) => acc + s.price, 0), [services]);

    const handleConfirm = () => {
        onConfirm();
    };

    const isFormValid = name.trim() !== '' && phone.trim().length >= 10;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Confirme os Detalhes</h2>

        <div className="bg-pink-50 p-6 rounded-xl border border-pink-200 space-y-4 mb-6">
            <div>
                <p className="text-sm font-medium text-pink-800">Serviços</p>
                <ul className="font-semibold text-gray-800 text-lg space-y-1 mt-1">
                  {services.map(s => (
                      <li key={s.id} className="flex justify-between items-baseline">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-base font-normal text-gray-600">R${s.price.toFixed(2)}</span>
                      </li>
                  ))}
                </ul>
            </div>
            <div className="flex justify-between">
                <div>
                    <p className="text-sm font-medium text-pink-800">Data</p>
                    <p className="font-semibold text-gray-800 text-lg">{date.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-pink-800">Horário</p>
                    <p className="font-semibold text-gray-800 text-lg">{time}</p>
                </div>
            </div>
             <div className="pt-4 border-t border-dashed border-pink-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-pink-800">Valor Total</p>
                  <p className="font-bold text-pink-600 text-xl">R${totalPrice.toFixed(2)}</p>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Seu Nome Completo</label>
                <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                    placeholder="Ex: Maria da Silva"
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
                />
            </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
             <button 
              onClick={onBack}
              className="text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Voltar
            </button>
            <button 
                onClick={handleConfirm}
                disabled={!isFormValid}
                className="bg-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
            >
                Finalizar Agendamento
            </button>
        </div>
    </div>
  );
};
