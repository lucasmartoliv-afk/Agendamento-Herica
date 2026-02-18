
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { getAvailableSlots } from '../availability';
import { BookedSlot } from '../types';
import { parseTime } from '../utils/bookingUtils';

interface DateTimePickerProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  serviceDuration: number;
  onBack: () => void;
  bookedSlots: BookedSlot[];
  preselectedDate?: Date | null;
  preselectedTime?: string | null;
}

const isSlotAvailable = (
    slot: string,
    duration: number,
    allDaySlots: string[],
    bookedForDay: { startTime: number; endTime: number }[]
): boolean => {
    const slotStart = parseTime(slot);
    const slotEnd = slotStart + duration;

    // Check for collision with booked slots
    for (const booked of bookedForDay) {
        if (slotStart < booked.endTime && slotEnd > booked.startTime) {
            return false;
        }
    }
    
    // Check if the slot duration is contiguous
    let contiguousDuration = 0;
    const slotIndex = allDaySlots.indexOf(slot);
    if (slotIndex === -1) return false;

    for (let i = slotIndex; i < allDaySlots.length; i++) {
        const currentSlotStart = parseTime(allDaySlots[i]);
        // Check for gaps
        if (i > slotIndex && currentSlotStart - parseTime(allDaySlots[i-1]) > 30) {
            return false;
        }
        
        contiguousDuration = parseTime(allDaySlots[i]) - slotStart + 30; // 30 is the base slot duration
        if (contiguousDuration >= duration) {
            // Final check to ensure the whole block is free
            const requiredEnd = slotStart + duration;
            for (const booked of bookedForDay) {
                if (slotStart < booked.endTime && requiredEnd > booked.startTime) {
                    return false;
                }
            }
            return true;
        }
    }

    return false;
};


export const DateTimePicker: React.FC<DateTimePickerProps> = ({ onDateTimeSelect, serviceDuration, onBack, bookedSlots, preselectedDate, preselectedTime }) => {
  const [currentDate, setCurrentDate] = useState(preselectedDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(preselectedDate || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(preselectedTime || null);
  
  // Generate available slots dynamically
  const AVAILABLE_SLOTS = useMemo(() => getAvailableSlots(), [currentDate.getMonth()]);

  useEffect(() => {
    if (preselectedDate) {
      setCurrentDate(preselectedDate);
      setSelectedDate(preselectedDate);
    }
  }, [preselectedDate]);

  useEffect(() => {
    if (preselectedTime) {
      setSelectedTime(preselectedTime);
    }
  }, [preselectedTime]);


  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const dateKey = selectedDate.toISOString().split('T')[0];
    const allDaySlots = AVAILABLE_SLOTS[dateKey] || [];
    
    const bookedForDay = bookedSlots
      .filter(b => b.date === dateKey)
      .map(b => ({
          startTime: parseTime(b.time),
          endTime: parseTime(b.time) + b.duration,
      }));

    return allDaySlots.filter(slot => 
      isSlotAvailable(slot, serviceDuration, allDaySlots, bookedForDay)
    );
  }, [selectedDate, serviceDuration, bookedSlots, AVAILABLE_SLOTS]);

  const daysInMonth = useMemo(() => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const days: (Date | null)[] = [];
    const firstDayIndex = date.getDay();

    for (let i = 0; i < firstDayIndex; i++) {
        days.push(null);
    }
    
    while (date.getMonth() === currentDate.getMonth()) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const handleDateSelect = (day: Date) => {
    if (day < today) return;
    const dateKey = day.toISOString().split('T')[0];
    if (!AVAILABLE_SLOTS[dateKey]) return; // Cannot select day with no slots

    setSelectedDate(day);
    setSelectedTime(null);
  };

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(1); // Avoid month skipping issues
        newDate.setMonth(newDate.getMonth() + amount);
        return newDate;
    });
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onDateTimeSelect(selectedDate, selectedTime);
    }
  }

  const isDateAvailable = useCallback((day: Date) => {
    if (day < today) return false;
    const dateKey = day.toISOString().split('T')[0];
    return AVAILABLE_SLOTS[dateKey] && AVAILABLE_SLOTS[dateKey].length > 0;
  }, [today, AVAILABLE_SLOTS]);

  const isDateSelected = useCallback((day: Date) => {
    return selectedDate?.toDateString() === day.toDateString();
  }, [selectedDate]);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Escolha a Data e Hora</h2>
        <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-pink-100 transition-colors">
                        <ChevronLeftIcon />
                    </button>
                    <h3 className="font-semibold text-lg text-gray-700 capitalize">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-pink-100 transition-colors">
                        <ChevronRightIcon />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((day, i) => (
                        <div key={i} className="flex justify-center items-center h-10">
                            {day && (
                                <button
                                    onClick={() => handleDateSelect(day)}
                                    disabled={!isDateAvailable(day)}
                                    className={`w-10 h-10 rounded-full transition-all duration-200
                                        ${isDateSelected(day) ? 'bg-pink-500 text-white scale-110' : ''}
                                        ${isDateAvailable(day) ? 'hover:bg-pink-200' : 'text-gray-300 cursor-not-allowed'}
                                        ${day.toDateString() === today.toDateString() && !isDateSelected(day) && isDateAvailable(day) ? 'border-2 border-pink-400' : ''}
                                    `}
                                >
                                    {day.getDate()}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Slots */}
            <div className="max-h-80 overflow-y-auto pr-2">
                {selectedDate ? (
                    <>
                        <h3 className="font-semibold text-lg text-gray-700 text-center mb-4">
                           Horários para {selectedDate.toLocaleDateString('pt-BR')}
                        </h3>
                         {timeSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 animate-fade-in-fast">
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                                            selectedTime === time 
                                                ? 'bg-pink-500 text-white shadow' 
                                                : 'bg-pink-100 text-pink-800 hover:bg-pink-200'
                                        }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
                                <p>Nenhum horário disponível para a duração do serviço selecionado.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50 rounded-lg">
                        <p>Selecione uma data</p>
                    </div>
                )}
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
              disabled={!selectedDate || !selectedTime}
              className="bg-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
            >
              Próximo
            </button>
        </div>
    </div>
  );
};
