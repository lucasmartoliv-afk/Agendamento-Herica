
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Service, BookedSlot, User } from './types';
import { ServiceSelector } from './components/ServiceSelector';
import { DateTimePicker } from './components/DateTimePicker';
import { Confirmation } from './components/Confirmation';
import { Header } from './components/Header';
import { ProgressTracker } from './components/ProgressTracker';
import { Success } from './components/Success';
import { Auth } from './components/Auth';
import { Welcome } from './components/Welcome';
import { BirthdayWish } from './components/BirthdayWish';
import { getBookedSlots, saveBookedSlot } from './utils/bookingUtils';
import { getUser, saveUser } from './utils/userUtils';
import { SERVICES } from './constants';

type AppState = 'AUTH' | 'WELCOME' | 'BIRTHDAY' | 'BOOKING';
type BookingStep = 'SERVICE' | 'DATETIME' | 'CONFIRMATION' | 'SUCCESS';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('AUTH');
  const [bookingStep, setBookingStep] = useState<BookingStep>('SERVICE');
  
  const [user, setUser] = useState<User | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);

  useEffect(() => {
    const existingUser = getUser();
    if (existingUser) {
      setUser(existingUser);
      setAppState('WELCOME');
    }
    setBookedSlots(getBookedSlots());
  }, []);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((total, service) => total + service.duration, 0);
  }, [selectedServices]);

  const handleRegister = (newUser: User) => {
    saveUser(newUser);
    setUser(newUser);
    setAppState('WELCOME');
  };

  const handleStartBooking = () => {
    if (!user) return;
    const today = new Date();
    // The birthDate is YYYY-MM-DD. Splitting is safe from timezone issues.
    const birthDateParts = user.birthDate.split('-');
    const birthMonth = parseInt(birthDateParts[1], 10) - 1; // JS months are 0-11

    if (today.getMonth() === birthMonth) {
      setAppState('BIRTHDAY');
    } else {
      setAppState('BOOKING');
    }
  };

  const handleContinueFromBirthday = () => {
    setAppState('BOOKING');
  };

  const handleToggleService = useCallback((service: Service) => {
    setSelectedServices(prev => {
        const isSelected = prev.some(s => s.id === service.id);
        if (isSelected) {
            return prev.filter(s => s.id !== service.id);
        } else {
            // This logic allows selecting multiple services from different categories
            const isDifferentCategory = !prev.some(s => s.category === service.category);
            if (isDifferentCategory) {
                 return [...prev, service];
            } else {
                // If it's the same category, replace the existing one
                const otherServices = prev.filter(s => s.category !== service.category);
                return [...otherServices, service];
            }
        }
    });
  }, []);


  const handleGoToDateTime = useCallback(() => {
    if (selectedServices.length > 0) {
        setBookingStep('DATETIME');
    }
  }, [selectedServices]);

  const handleDateTimeSelect = useCallback((date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setBookingStep('CONFIRMATION');
  }, []);
  
  const handleBookingConfirmed = useCallback(() => {
    if (selectedDate && selectedTime) {
        const newBooking: BookedSlot = {
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            duration: totalDuration,
        };
        saveBookedSlot(newBooking);
        setBookedSlots(prev => [...prev, newBooking]);
        setBookingStep('SUCCESS');
    }
  }, [selectedDate, selectedTime, totalDuration]);

  const handleBack = useCallback(() => {
    if (bookingStep === 'DATETIME') {
      setBookingStep('SERVICE');
    } else if (bookingStep === 'CONFIRMATION') {
      setBookingStep('DATETIME');
    }
  }, [bookingStep]);

  const handleReset = useCallback(() => {
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingStep('SERVICE');
    setAppState('WELCOME');
  }, []);

  const renderBookingStep = () => {
    if (!user) return null; // Should not happen in this state

    switch (bookingStep) {
      case 'SERVICE':
        return <ServiceSelector 
            selectedServices={selectedServices}
            onToggleService={handleToggleService}
            onNext={handleGoToDateTime}
        />;
      case 'DATETIME':
        return <DateTimePicker 
            onDateTimeSelect={handleDateTimeSelect} 
            serviceDuration={totalDuration} 
            onBack={handleBack}
            bookedSlots={bookedSlots}
            preselectedDate={selectedDate}
            preselectedTime={selectedTime}
        />;
      case 'CONFIRMATION':
        if (selectedServices.length > 0 && selectedDate && selectedTime) {
          return (
            <Confirmation
              user={user}
              services={selectedServices}
              date={selectedDate} 
              time={selectedTime} 
              onConfirm={handleBookingConfirmed}
              onBack={handleBack}
            />
          );
        }
        return null;
      case 'SUCCESS':
         if (selectedServices.length > 0 && selectedDate && selectedTime) {
            return (
                <Success 
                    services={selectedServices}
                    date={selectedDate}
                    time={selectedTime}
                    onReset={handleReset}
                />
            )
         }
         return null;
    }
  };

  const renderContent = () => {
    switch(appState) {
        case 'AUTH':
            return <Auth onRegister={handleRegister} />;
        case 'WELCOME':
            if (user) {
                return <Welcome user={user} onStartBooking={handleStartBooking} />;
            }
            return <Auth onRegister={handleRegister} />; // Fallback
        case 'BIRTHDAY':
             if (user) {
                return <BirthdayWish user={user} onContinue={handleContinueFromBirthday} />;
            }
            return <Auth onRegister={handleRegister} />; // Fallback
        case 'BOOKING':
            return (
                <>
                    <ProgressTracker currentStep={bookingStep} />
                    <div className="mt-6">
                        {renderBookingStep()}
                    </div>
                </>
            );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 font-sans flex flex-col items-center p-4">
      <Header />
      <main className="w-full max-w-2xl mx-auto mt-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
