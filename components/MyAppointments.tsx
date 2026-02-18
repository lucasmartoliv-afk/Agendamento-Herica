
import React, { useMemo } from 'react';
import { BookedSlot, User } from '../types';
import { getBookedSlots } from '../utils/bookingUtils';

interface MyAppointmentsProps {
    user: User;
    onBack: () => void;
    onNewBooking: () => void;
}

const AppointmentCard: React.FC<{ booking: BookedSlot }> = ({ booking }) => {
    const totalPrice = useMemo(() => booking.services.reduce((acc, s) => acc + s.price, 0), [booking.services]);
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    const isPast = bookingDate < new Date();

    return (
        <div className={`bg-white p-4 rounded-xl shadow-md transition-all duration-300 ${isPast ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`font-bold text-lg ${isPast ? 'text-gray-600' : 'text-pink-600'}`}>
                        {bookingDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                    </p>
                    <p className="text-gray-700 font-semibold">{booking.time}</p>
                </div>
                <div className={`px-3 py-1 text-xs font-semibold rounded-full ${isPast ? 'bg-gray-200 text-gray-700' : 'bg-pink-100 text-pink-800'}`}>
                    {isPast ? 'Realizado' : 'Agendado'}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <ul className="space-y-1">
                    {booking.services.map(service => (
                        <li key={service.id} className="flex justify-between text-sm text-gray-600">
                            <span>{service.name}</span>
                            <span className="font-medium">R${service.price.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end font-bold text-gray-800 mt-2">
                    Total: R${totalPrice.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export const MyAppointments: React.FC<MyAppointmentsProps> = ({ user, onBack, onNewBooking }) => {
    const allBookings = useMemo(() => getBookedSlots(), []);

    const userBookings = useMemo(() => {
        return allBookings
            .filter(booking => booking.userName === user.name && booking.userPhone === user.phone)
            .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()); // Sort descending
    }, [allBookings, user]);

    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg animate-fade-in w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Meus Agendamentos</h2>
                <button onClick={onBack} className="text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    Voltar
                </button>
            </div>

            {userBookings.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {userBookings.map((booking, index) => (
                        <AppointmentCard key={`${booking.date}-${booking.time}-${index}`} booking={booking} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">Você ainda não possui agendamentos.</p>
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                    onClick={onNewBooking}
                    className="w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    Fazer Novo Agendamento
                </button>
            </div>
        </div>
    );
};
