
import React, { useMemo } from 'react';
import { BookedSlot } from '../types';
import { XMarkIcon } from './icons';

interface ClientDetailsModalProps {
    bookings: BookedSlot[];
    onClose: () => void;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ bookings, onClose }) => {
    if (!bookings || bookings.length === 0) return null;

    const clientName = bookings[0].userName;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Agendamentos de {clientName.split(' ')[0]}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <XMarkIcon />
                    </button>
                </div>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {bookings.map((booking, index) => {
                        const totalPrice = booking.services.reduce((acc, s) => acc + s.price, 0);
                        const bookingDate = new Date(`${booking.date}T00:00:00`);

                        return (
                            <div key={index} className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <p className="text-pink-800">{bookingDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {booking.time}</p>
                                    <p className="text-pink-600">R${totalPrice.toFixed(2)}</p>
                                </div>
                                <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
                                    {booking.services.map(s => <li key={s.id}>{s.name}</li>)}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
