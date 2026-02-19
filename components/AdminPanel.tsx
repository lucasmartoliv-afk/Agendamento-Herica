import React, { useState, useEffect, useMemo } from 'react';
import { getBookedSlots } from '../utils/bookingUtils';
import { BookedSlot, AvailabilitySettings, ScheduleException, Service, User } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, ArrowDownTrayIcon, CurrencyDollarIcon, UserGroupIcon, SparklesIcon as SparklesIconStat } from './icons';
import { ClientDetailsModal } from './ClientDetailsModal';
import { getAvailabilitySettings, saveAvailabilitySettings } from '../utils/availabilityUtils';
import { getServices } from '../utils/serviceUtils';
import { ServiceManager } from './ServiceManager';
import { getUser } from '../utils/userUtils';
import { PasswordManager } from './PasswordManager';

type AdminTab = 'dashboard' | 'agenda' | 'reports' | 'availability' | 'services' | 'security';

interface AdminPanelProps {
    onBack: () => void;
}

const abbreviateServiceName = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('manutenção')) {
        const days = nameLower.match(/\d+/);
        return `Manut. ${days ? days[0] : ''}d`;
    }
    if (nameLower.includes('fio a fio')) return 'Clássico';
    if (nameLower.includes('brasileiro')) return 'Vol. Brasileiro';
    if (nameLower.includes('russo')) return 'Vol. Russo';
    if (nameLower.includes('egípcio')) return 'Vol. Egípcio';
    if (nameLower.includes('mega volume')) return 'Mega Vol.';
    if (nameLower.includes('gatinho')) return 'Gatinho';
    if (nameLower.includes('boneca')) return 'Boneca';
    if (nameLower.includes('fox eyes')) return 'Fox Eyes';
    if (nameLower.includes('design com henna')) return 'Design c/ Henna';
    if (nameLower.includes('design simples')) return 'Design';
    if (nameLower.includes('rosto completo')) return 'Rosto Comp.';
    return name;
};

const AppointmentChip: React.FC<{ booking: BookedSlot; onClick?: () => void }> = ({ booking, onClick }) => {
    const totalPrice = useMemo(() => booking.services.reduce((acc, s) => acc + s.price, 0), [booking.services]);
    const firstName = booking.userName.split(' ')[0];
    const abbreviatedServices = useMemo(() => 
        booking.services.map(s => abbreviateServiceName(s.name)).join(' + '), 
        [booking.services]
    );

    const content = (
        <div className="bg-pink-100 text-pink-900 p-1.5 rounded-lg mb-1 text-xs leading-tight space-y-1">
            <div className="flex justify-between items-center">
                <p className="font-bold">{booking.time}</p>
                <p className="font-semibold">R${totalPrice.toFixed(2)}</p>
            </div>
            <div>
                 <p className="font-semibold text-pink-800">{firstName}</p>
                 <p className="truncate text-pink-700" title={abbreviatedServices}>{abbreviatedServices}</p>
            </div>
        </div>
    );

    return onClick ? <button className="w-full" onClick={onClick}>{content}</button> : content;
}

const AvailabilityManager: React.FC = () => {
    const [settings, setSettings] = useState<AvailabilitySettings>(getAvailabilitySettings());
    const [saved, setSaved] = useState(false);
    const [newException, setNewException] = useState<Partial<ScheduleException>>({ date: '', isWorking: true, startTime: '09:00', endTime: '17:00' });
    
    const handleDayToggle = (dayIndex: number) => {
        setSettings(prev => {
            const workDays = prev.workDays.includes(dayIndex)
                ? prev.workDays.filter(d => d !== dayIndex)
                : [...prev.workDays, dayIndex];
            return { ...prev, workDays: [...workDays].sort() };
        });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAddException = () => {
        if (!newException.date) return;
        const finalException = {
            date: newException.date,
            isWorking: newException.isWorking ?? true,
            startTime: newException.startTime ?? '09:00',
            endTime: newException.endTime ?? '17:00',
        };

        setSettings(prev => ({
            ...prev,
            exceptions: [...prev.exceptions.filter(ex => ex.date !== finalException.date), finalException]
                .sort((a,b) => a.date.localeCompare(b.date))
        }));
        setNewException({ date: '', isWorking: true, startTime: '09:00', endTime: '17:00' });
    };

    const handleRemoveException = (date: string) => {
        setSettings(prev => ({
            ...prev,
            exceptions: prev.exceptions.filter(ex => ex.date !== date)
        }));
    };
    
    const handleSaveSettings = () => {
        saveAvailabilitySettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000); // Hide message after 2s
    }

    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
                <h4 className="font-bold text-gray-800 mb-4">Horário Padrão</h4>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dias de Trabalho</label>
                        <div className="flex flex-wrap gap-2">
                            {weekDays.map((day, index) => (
                               <button
                                    key={index}
                                    onClick={() => handleDayToggle(index)}
                                    className={`px-3 py-2 text-sm rounded-lg font-semibold transition-colors ${settings.workDays.includes(index) ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                               >
                                   {day}
                               </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Trabalho</label>
                        <div className="flex items-center gap-4">
                            <input type="time" name="startTime" value={settings.startTime} onChange={handleTimeChange} className="p-2 border rounded-md"/>
                            <span>até</span>
                            <input type="time" name="endTime" value={settings.endTime} onChange={handleTimeChange} className="p-2 border rounded-md"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
                <h4 className="font-bold text-gray-800 mb-4">Exceções de Horário</h4>
                <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <input type="date" value={newException.date} onChange={e => setNewException(p => ({...p, date: e.target.value}))} className="p-2 border rounded-md" />
                        <label className="flex items-center gap-2">
                             <input type="checkbox" checked={newException.isWorking} onChange={e => setNewException(p => ({...p, isWorking: e.target.checked}))} className="h-4 w-4 rounded text-pink-600 focus:ring-pink-500"/>
                             <span>Dia de trabalho</span>
                        </label>
                    </div>
                    {newException.isWorking && (
                         <div className="flex items-center gap-4">
                            <input type="time" value={newException.startTime} onChange={e => setNewException(p => ({...p, startTime: e.target.value}))} className="p-2 border rounded-md w-full"/>
                            <span>até</span>
                            <input type="time" value={newException.endTime} onChange={e => setNewException(p => ({...p, endTime: e.target.value}))} className="p-2 border rounded-md w-full"/>
                        </div>
                    )}
                    <button onClick={handleAddException} disabled={!newException.date} className="w-full md:w-auto bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-gray-700 disabled:bg-gray-300">
                        Adicionar/Atualizar Exceção
                    </button>
                </div>
                 {settings.exceptions.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                        {settings.exceptions.map(ex => (
                            <div key={ex.date} className="flex justify-between items-center p-2 bg-pink-50 rounded-md">
                                <p className="text-sm font-medium text-pink-800">
                                    {new Date(ex.date + 'T00:00:00').toLocaleDateString('pt-BR')}: {ex.isWorking ? `${ex.startTime} - ${ex.endTime}` : 'Folga'}
                                </p>
                                <button onClick={() => handleRemoveException(ex.date)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><XMarkIcon /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button onClick={handleSaveSettings} className="bg-pink-500 text-white font-bold py-2 px-6 rounded-lg transition-colors hover:bg-pink-600">
                    Salvar Todas as Alterações
                </button>
                {saved && <p className="text-green-600 text-sm animate-fade-in">Configurações salvas com sucesso!</p>}
            </div>
        </div>
    );
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
    const [bookings, setBookings] = useState<BookedSlot[]>([]);
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [selectedClientBookings, setSelectedClientBookings] = useState<BookedSlot[] | null>(null);

    // Reports state
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonths, setSelectedMonths] = useState<number[]>([new Date().getMonth()]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
    
    const todayString = useMemo(() => new Date().toDateString(), []);

    useEffect(() => {
        setBookings(getBookedSlots());
        setAllServices(getServices());
    }, [activeTab]);

    const handleAppointmentClick = (booking: BookedSlot) => {
        const clientBookings = bookings.filter(b => b.userPhone === booking.userPhone && b.userName === booking.userName);
        setSelectedClientBookings(clientBookings);
    };

    const groupedServicesByCategory = useMemo(() => {
        return allServices.reduce((acc, service) => {
            (acc[service.category] = acc[service.category] || []).push(service);
            return acc;
        }, {} as Record<string, Service[]>);
    }, [allServices]);
    
    const filteredBookingsByDate = useMemo(() => {
        if (selectedMonths.length === 0) return [];
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.date + "T00:00:00");
            return bookingDate.getFullYear() === selectedYear && selectedMonths.includes(bookingDate.getMonth());
        });
    }, [bookings, selectedYear, selectedMonths]);

    const filteredBookings = useMemo(() => {
        if (selectedServiceIds.length === 0) {
            return filteredBookingsByDate;
        }
        return filteredBookingsByDate.filter(booking => 
            booking.services.some(service => selectedServiceIds.includes(service.id))
        );
    }, [filteredBookingsByDate, selectedServiceIds]);
    
    const groupedBookingsByDay = useMemo(() => {
        return bookings.reduce((acc, booking) => {
            const date = booking.date;
            (acc[date] = acc[date] || []).push(booking);
            acc[date].sort((a,b) => a.time.localeCompare(b.time));
            return acc;
        }, {} as Record<string, BookedSlot[]>);
    }, [bookings]);

    const monthlyRevenueData = useMemo(() => {
        const revenueMap = new Map<number, number>();
        selectedMonths.forEach(m => revenueMap.set(m, 0));

        filteredBookings.forEach(booking => {
            const bookingDate = new Date(booking.date + "T00:00:00");
            const month = bookingDate.getMonth();
            if (revenueMap.has(month)) {
                const currentTotal = revenueMap.get(month) || 0;
                const bookingTotal = booking.services.reduce((acc, s) => acc + s.price, 0);
                revenueMap.set(month, currentTotal + bookingTotal);
            }
        });
        return Array.from(revenueMap.entries()).sort((a,b) => a[0] - b[0]);
    }, [filteredBookings, selectedMonths]);

    const filteredStats = useMemo(() => {
        const stats = {
            totalRevenue: 0,
            services: {} as Record<string, { count: number, total: number }>
        };

        filteredBookings.forEach(booking => {
            booking.services.forEach(service => {
                stats.totalRevenue += service.price;
                if (!stats.services[service.category]) {
                    stats.services[service.category] = { count: 0, total: 0 };
                }
                stats.services[service.category].count += 1;
                stats.services[service.category].total += service.price;
            });
        });
        return stats;
    }, [filteredBookings]);

    const filteredClients = useMemo(() => {
        const clients = new Map<string, { name: string; userPhone: string; bookings: BookedSlot[] }>();
        filteredBookings.forEach(booking => {
            const key = booking.userPhone;
            if (!clients.has(key)) {
                clients.set(key, { name: booking.userName, userPhone: booking.userPhone, bookings: [] });
            }
            clients.get(key)!.bookings.push(booking);
        });
        return Array.from(clients.values()).sort((a,b) => a.name.localeCompare(b.name));
    }, [filteredBookings]);

    const daysInMonth = useMemo(() => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const days: (Date | null)[] = [];
        const firstDayIndex = date.getDay();
        for (let i = 0; i < firstDayIndex; i++) days.push(null);
        while (date.getMonth() === currentDate.getMonth()) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentDate]);

    // Dashboard Data - Moved to top level to fix hook violation
    const now = useMemo(() => new Date(), []);
    const todayKey = useMemo(() => now.toISOString().split('T')[0], [now]);
    const currentMonth = useMemo(() => now.getMonth(), [now]);
    const currentYear = useMemo(() => now.getFullYear(), [now]);

    const todaysBookings = useMemo(() => 
        (groupedBookingsByDay[todayKey] || []),
        [groupedBookingsByDay, todayKey]
    );

    const thisMonthStats = useMemo(() => {
        const bookingsThisMonth = bookings.filter(b => {
            const d = new Date(b.date + 'T00:00:00');
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const revenue = bookingsThisMonth.reduce((total, booking) => total + booking.services.reduce((sum, s) => sum + s.price, 0), 0);
        const clients = new Set(bookingsThisMonth.map(b => b.userPhone)).size;
        const servicesCount = bookingsThisMonth.reduce((total, b) => total + b.services.length, 0);

        return { revenue, clients, servicesCount };
    }, [bookings, currentMonth, currentYear]);

    const thisMonthBirthdays = useMemo(() => {
        const clientsWithBirthdays = new Map<string, {name: string, date: string}>();
        bookings.forEach(b => {
            const user = getUser();
            if (user && user.phone === b.userPhone) {
                const birthMonth = new Date(user.birthDate + 'T00:00:00').getMonth();
                if(birthMonth === currentMonth && !clientsWithBirthdays.has(user.phone)) {
                    const birthDay = new Date(user.birthDate + 'T00:00:00').getDate();
                    clientsWithBirthdays.set(user.phone, { name: user.name, date: `${birthDay}/${currentMonth + 1}`});
                }
            }
        });
            return Array.from(clientsWithBirthdays.values());
    }, [bookings, currentMonth]);


    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    
    const handleMonthSelect = (monthIndex: number) => {
        setSelectedMonths(prev => 
            prev.includes(monthIndex) 
                ? prev.filter(m => m !== monthIndex)
                : [...prev, monthIndex]
        );
    };

    const handleServiceIdToggle = (serviceId: string) => {
        setSelectedServiceIds(prev => 
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };
    
    const handleCategoryToggle = (categoryName: string) => {
        const serviceIdsInCategory = groupedServicesByCategory[categoryName]?.map(s => s.id) || [];
        if (serviceIdsInCategory.length === 0) return;

        const allSelected = serviceIdsInCategory.every(id => selectedServiceIds.includes(id));

        if (allSelected) {
            setSelectedServiceIds(prev => prev.filter(id => !serviceIdsInCategory.includes(id)));
        } else {
            setSelectedServiceIds(prev => [...new Set([...prev, ...serviceIdsInCategory])]);
        }
    };
    
    const handleClearFilters = () => {
        setSelectedYear(new Date().getFullYear());
        setSelectedMonths([]);
        setSelectedServiceIds([]);
    };

    const handleExportCSV = () => {
        const headers = ['Data', 'Hora', 'Cliente', 'Telefone', 'Serviço', 'Categoria', 'Duração (min)', 'Preço (R$)'];
        const rows = filteredBookings.flatMap(booking => 
            booking.services.map(service => [
                new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR'),
                booking.time,
                `"${booking.userName.replace(/"/g, '""')}"`,
                booking.userPhone,
                `"${service.name.replace(/"/g, '""')}"`,
                `"${service.category.replace(/"/g, '""')}"`,
                service.duration,
                service.price.toFixed(2).replace('.', ',')
            ].join(','))
        );

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `relatorio_herica_studio_${date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const RevenueChart = () => {
        const maxRevenue = Math.max(...monthlyRevenueData.map(([, total]) => total), 0);
        if (maxRevenue === 0) return null;

        return (
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
                <h4 className="font-bold text-gray-800 mb-4">Faturamento Mensal</h4>
                <div className="flex justify-around items-end h-40 gap-2">
                    {monthlyRevenueData.map(([month, total]) => {
                         const heightPercentage = maxRevenue > 0 ? (total / maxRevenue) * 100 : 0;
                         return (
                            <div key={month} className="flex flex-col items-center h-full justify-end">
                                <p className="text-xs font-semibold text-pink-600">R${total.toFixed(0)}</p>
                                <div 
                                    className="w-8 bg-pink-300 rounded-t-md hover:bg-pink-400 transition-colors"
                                    style={{ height: `${heightPercentage}%` }}
                                    title={`R$${total.toFixed(2)}`}
                                ></div>
                                <p className="text-xs font-medium text-gray-500 mt-1">
                                    {new Date(0, month).toLocaleString('pt-BR', { month: 'short' })}
                                </p>
                            </div>
                         )
                    })}
                </div>
            </div>
        )
    }

    const renderReports = () => (
        <div className="animate-fade-in space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800">Filtros do Relatório</h4>
                    <div className="flex items-center gap-2">
                         <button onClick={handleClearFilters} className="text-sm bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-lg transition-colors hover:bg-gray-300">
                            Limpar Filtros
                        </button>
                        <button onClick={handleExportCSV} disabled={filteredBookings.length === 0} className="flex items-center gap-2 text-sm bg-green-600 text-white font-semibold py-1.5 px-3 rounded-lg transition-colors hover:bg-green-700 disabled:bg-gray-300">
                            <ArrowDownTrayIcon />
                            Exportar
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <button onClick={() => setSelectedYear(y => y - 1)} className="p-2 rounded-full hover:bg-pink-100 transition-colors"><ChevronLeftIcon /></button>
                    <span className="font-semibold text-lg text-gray-700 w-24 text-center">{selectedYear}</span>
                    <button onClick={() => setSelectedYear(y => y + 1)} className="p-2 rounded-full hover:bg-pink-100 transition-colors"><ChevronRightIcon /></button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {Array.from({length: 12}).map((_, i) => (
                        <button key={i} onClick={() => handleMonthSelect(i)} className={`p-2 text-xs rounded-md font-semibold ${selectedMonths.includes(i) ? 'bg-pink-500 text-white' : 'bg-white'}`}>
                            {new Date(0, i).toLocaleString('pt-BR', {month: 'short'})}
                        </button>
                    ))}
                </div>
                 <button onClick={() => setSelectedMonths(selectedMonths.length === 12 ? [] : Array.from({length: 12}).map((_, i) => i))} className="w-full text-xs font-semibold text-gray-600 hover:text-pink-600 p-1">
                    {selectedMonths.length === 12 ? 'Limpar Seleção' : 'Selecionar Todos'}
                </button>
                <div className="pt-4 border-t space-y-3">
                     {Object.entries(groupedServicesByCategory).map(([category, services]) => {
                        const allInCategorySelected = services.every(s => selectedServiceIds.includes(s.id));
                         return (
                            <div key={category}>
                                <div className="flex items-center gap-2 mb-2">
                                    <button onClick={() => handleCategoryToggle(category)} className={`px-3 py-1 text-xs rounded-full font-bold ${allInCategorySelected ? 'bg-pink-500 text-white' : 'bg-white'}`}>{category}</button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {services.map(service => (
                                        <button key={service.id} onClick={() => handleServiceIdToggle(service.id)} className={`px-2 py-0.5 text-xs rounded-full font-semibold ${selectedServiceIds.includes(service.id) ? 'bg-pink-700 text-white' : 'bg-white text-pink-800'}`}>
                                            {service.name}
                                        </button>
                                    ))}
                                </div>
                             </div>
                         )
                    })}
                </div>
            </div>
            
            <div className="flex justify-end items-center">
                <p className="text-md font-medium text-gray-700">Faturamento do Período:</p>
                <p className="text-2xl font-bold text-pink-600 ml-4">R${filteredStats.totalRevenue.toFixed(2)}</p>
            </div>

            {monthlyRevenueData.length > 0 && <RevenueChart />}

             <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 xl:col-span-2 p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
                    <h4 className="font-bold text-gray-800 mb-4">Resumo Por Categoria</h4>
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
                        {Object.entries(filteredStats.services).map(([category, data]) => (
                             <div key={category} className="bg-white p-4 rounded-lg flex items-start gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold">{category}</p>
                                    <p className="text-xl font-bold text-gray-800">R${data.total.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">{data.count} serviço(s)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-3 xl:col-span-1 p-4 bg-white rounded-lg shadow-sm border">
                    <h4 className="font-bold text-gray-800 mb-4">Clientes do Período ({filteredClients.length})</h4>
                    <div className="max-h-64 overflow-y-auto pr-2">
                        {filteredClients.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredClients.map(client => (
                                    <li key={client.name + client.userPhone}>
                                        <button onClick={() => setSelectedClientBookings(client.bookings)} className="w-full text-left p-2 rounded-md hover:bg-pink-50 transition-colors text-sm font-medium text-gray-700">
                                            {client.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">Nenhum dado encontrado para os filtros selecionados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAgenda = () => (
        <div className="animate-fade-in">
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 font-medium mb-2 border-b pb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                 {daysInMonth.map((day, i) => {
                    const dateKey = day ? day.toISOString().split('T')[0] : '';
                    const dailyBookingsForDay = groupedBookingsByDay[dateKey] || [];
                    const isToday = day && day.toDateString() === todayString;

                    return (
                        <div key={i} className={`h-28 sm:h-32 border border-gray-100 rounded-lg p-1.5 overflow-y-auto ${day ? 'bg-white' : 'bg-gray-50'}`}>
                            {day && (
                                <>
                                    <span className={`text-xs font-semibold ${isToday ? 'bg-pink-500 text-white rounded-full flex items-center justify-center h-5 w-5' : 'text-gray-600'}`}>
                                        {day.getDate()}
                                    </span>
                                    <div className="mt-1">
                                        {dailyBookingsForDay.map(booking => (
                                            <AppointmentChip 
                                                key={booking.time + booking.userName} 
                                                booking={booking}
                                                onClick={() => handleAppointmentClick(booking)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                 })}
            </div>
        </div>
    );

     const renderDashboard = () => {
        const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
            <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
                <div className="bg-pink-100 text-pink-600 p-3 rounded-full">{icon}</div>
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        );

        return (
            <div className="animate-fade-in space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <StatCard title="Faturamento do Mês" value={`R$${thisMonthStats.revenue.toFixed(2)}`} icon={<CurrencyDollarIcon />} />
                    <StatCard title="Clientes Atendidas" value={thisMonthStats.clients} icon={<UserGroupIcon />} />
                    <StatCard title="Serviços Prestados" value={thisMonthStats.servicesCount} icon={<SparklesIconStat />} />
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                     <div className="p-4 bg-white rounded-lg shadow-sm border">
                         <h4 className="font-bold text-gray-800 mb-4">Agenda de Hoje ({todaysBookings.length})</h4>
                         <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                             {todaysBookings.length > 0 ? todaysBookings.map(b => (
                                 <div key={b.time + b.userName} className="bg-pink-50 p-3 rounded-md">
                                     <div className="flex justify-between font-semibold">
                                         <p className="text-pink-900">{b.time}</p>
                                         <p className="text-pink-800">{b.userName.split(' ')[0]}</p>
                                     </div>
                                     <p className="text-xs text-pink-700 truncate">{b.services.map(s => s.name).join(', ')}</p>
                                 </div>
                             )) : <p className="text-sm text-center text-gray-500 py-4">Nenhum agendamento para hoje.</p>}
                         </div>
                     </div>
                     <div className="p-4 bg-white rounded-lg shadow-sm border">
                         <h4 className="font-bold text-gray-800 mb-4">Aniversariantes do Mês</h4>
                          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                             {thisMonthBirthdays.length > 0 ? thisMonthBirthdays.map(c => (
                                <div key={c.name} className="flex justify-between items-center p-2 rounded-md hover:bg-pink-50">
                                    <p className="text-sm font-medium text-gray-700">{c.name}</p>
                                    <p className="text-sm font-semibold text-pink-600">{c.date}</p>
                                </div>
                             )) : <p className="text-sm text-center text-gray-500 py-4">Nenhuma aniversariante este mês.</p>}
                         </div>
                     </div>
                 </div>
            </div>
        );
     };

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard': return renderDashboard();
            case 'agenda': return renderAgenda();
            case 'reports': return renderReports();
            case 'availability': return <AvailabilityManager />;
            case 'services': return <ServiceManager />;
            case 'security': return <PasswordManager />;
            default: return null;
        }
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg animate-fade-in w-full">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Painel Administrativo</h2>
                 <div className="flex items-center justify-end flex-grow">
                     {activeTab === 'agenda' && (
                        <div className="flex items-center">
                            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-pink-100 transition-colors"><ChevronLeftIcon /></button>
                            <h3 className="font-semibold text-lg text-gray-700 capitalize w-36 text-center">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-pink-100 transition-colors"><ChevronRightIcon /></button>
                        </div>
                     )}
                    <button onClick={onBack} className="text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors ml-4">
                        Sair
                    </button>
                </div>
            </div>
            
            <div className="flex border-b mb-6 flex-wrap">
                <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'dashboard' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'}`}>Painel</button>
                <button onClick={() => setActiveTab('agenda')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'agenda' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'}`}>Agenda</button>
                <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'reports' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'}`}>Relatórios</button>
                <button onClick={() => setActiveTab('availability')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'availability' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'}`}>Disponibilidade</button>
                <button onClick={() => setActiveTab('services')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'services' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'}`}>Gestão de Serviços</button>
                <button onClick={() => setActiveTab('security')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'security' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'}`}>Segurança</button>
            </div>
            
            {renderContent()}

            {selectedClientBookings && (
                <ClientDetailsModal 
                    bookings={selectedClientBookings} 
                    onClose={() => setSelectedClientBookings(null)} 
                />
            )}
        </div>
    );
};