
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
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { getBookedSlots, saveBookedSlot } from './utils/bookingUtils';
import { getUser, saveUser } from './utils/userUtils';
import { seedInitialData } from './utils/seed';
import { MyAppointments } from './components/MyAppointments';

type AppState = 'AUTH' | 'WELCOME' | 'BIRTHDAY' | 'BOOKING' | 'ADMIN' | 'MY_APPOINTMENTS';
type BookingStep = 'SERVICE' | 'DATETIME' | 'CONFIRMATION' | 'SUCCESS';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('AUTH');
  const [bookingStep, setBookingStep] = useState<BookingStep>('SERVICE');
  
  const [user, setUser] = useState<User | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    seedInitialData(); // Populates with mock data if it's the first run
    const existingUser = getUser();
    if (existingUser) {
      setUser(existingUser);
      setAppState('WELCOME');
    }
    setBookedSlots(getBookedSlots());
  }, []);

  const totalDuration = useMemo(() => {
    if (selectedServices.length === 0) return 0;
    const baseDuration = selectedServices.reduce((total, service) => total + service.duration, 0);
    // Adds a 10-minute buffer for each selected service
    const buffer = selectedServices.length * 10;
    return baseDuration + buffer;
  }, [selectedServices]);

  const handleRegister = (newUser: User) => {
    saveUser(newUser);
    setUser(newUser);
    setAppState('WELCOME');
  };

  const handleStartBooking = () => {
    if (!user) return;
    const today = new Date();
    const birthDateParts = user.birthDate.split('-');
    const birthMonth = parseInt(birthDateParts[1], 10) - 1;

    if (today.getMonth() === birthMonth) {
      setAppState('BIRTHDAY');
    } else {
      setAppState('BOOKING');
    }
  };
  
  const handleViewAppointments = () => {
    setAppState('MY_APPOINTMENTS');
  };

  const handleGoToAdmin = () => {
    setShowAdminLogin(true);
  }

  const handleAdminLoginSuccess = () => {
    setAppState('ADMIN');
    setShowAdminLogin(false);
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
            const isDifferentCategory = !prev.some(s => s.category === service.category);
            if (isDifferentCategory) {
                 return [...prev, service];
            } else {
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
    if (selectedDate && selectedTime && user) {
        const newBooking: BookedSlot = {
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            duration: totalDuration,
            userName: user.name,
            userPhone: user.phone,
            services: selectedServices,
        };
        saveBookedSlot(newBooking);
        setBookedSlots(prev => [...prev, newBooking]);
        setBookingStep('SUCCESS');
    }
  }, [selectedDate, selectedTime, totalDuration, user, selectedServices]);

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
    if (!user) return null;

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
                return <Welcome user={user} onStartBooking={handleStartBooking} onViewAppointments={handleViewAppointments} />;
            }
            return <Auth onRegister={handleRegister} />;
        case 'MY_APPOINTMENTS':
             if (user) {
                return <MyAppointments 
                    user={user} 
                    onBack={() => setAppState('WELCOME')} 
                    onNewBooking={handleStartBooking}
                />;
            }
            return <Auth onRegister={handleRegister} />;
        case 'BIRTHDAY':
             if (user) {
                return <BirthdayWish user={user} onContinue={handleContinueFromBirthday} />;
            }
            return <Auth onRegister={handleRegister} />;
        case 'ADMIN':
            return <AdminPanel onBack={() => {
                const existingUser = getUser();
                if (existingUser) {
                    setAppState('WELCOME');
                } else {
                    setAppState('AUTH');
                }
            }} />;
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
      <Header onGoToAdmin={handleGoToAdmin} />
      <main className="w-full max-w-4xl mx-auto mt-8">
        {renderContent()}
      </main>
      {showAdminLogin && (
        <AdminLogin 
            onClose={() => setShowAdminLogin(false)} 
            onSuccess={handleAdminLoginSuccess} 
        />
      )}
    </div>
  );
};

export default App;
