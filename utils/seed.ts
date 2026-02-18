
import { BookedSlot, Service } from '../types';
import { getServices } from './serviceUtils';

const MOCK_BOOKINGS_DATA: (Omit<BookedSlot, 'duration' | 'services'> & { serviceIds: string[] })[] = [
  // February 2024
  { date: '2024-02-05', time: '10:00', userName: 'Ana Silva', userPhone: '11987654321', serviceIds: ['cilios_classico'] },
  { date: '2024-02-06', time: '14:30', userName: 'Beatriz Costa', userPhone: '11912345678', serviceIds: ['sob_henna', 'epil_buco'] },
  { date: '2024-02-08', time: '11:00', userName: 'Carla Dias', userPhone: '11923456789', serviceIds: ['cilios_brasileiro'] },
  { date: '2024-02-12', time: '16:00', userName: 'Daniela Souza', userPhone: '11934567890', serviceIds: ['manut_15'] },
  { date: '2024-02-15', time: '09:30', userName: 'Eduarda Lima', userPhone: '11945678901', serviceIds: ['sob_simples'] },
  { date: '2024-02-20', time: '13:00', userName: 'Fernanda Alves', userPhone: '11956789012', serviceIds: ['cilios_russo'] },
  { date: '2024-02-22', time: '15:00', userName: 'Gabriela Melo', userPhone: '11967890123', serviceIds: ['epil_rosto'] },
  { date: '2024-02-27', time: '10:30', userName: 'Helena Rocha', userPhone: '11978901234', serviceIds: ['manut_20'] },

  // March 2024
  { date: '2024-03-04', time: '09:00', userName: 'Isabela Barros', userPhone: '11989012345', serviceIds: ['cilios_mega'] },
  { date: '2024-03-05', time: '13:30', userName: 'Juliana Castro', userPhone: '11990123456', serviceIds: ['sob_henna'] },
  { date: '2024-03-07', time: '11:30', userName: 'Ana Silva', userPhone: '11987654321', serviceIds: ['manut_25'] },
  { date: '2024-03-11', time: '16:30', userName: 'Larissa Cunha', userPhone: '11901234567', serviceIds: ['cilios_gatinho'] },
  { date: '2024-03-14', time: '10:00', userName: 'Manuela Gomes', userPhone: '11911223344', serviceIds: ['sob_simples', 'epil_buco'] },
  { date: '2024-03-19', time: '14:00', userName: 'Beatriz Costa', userPhone: '11912345678', serviceIds: ['manut_15'] },
  { date: '2024-03-21', time: '17:00', userName: 'Natalia Jesus', userPhone: '11922334455', serviceIds: ['cilios_fox'] },
  { date: '2024-03-26', time: '09:30', userName: 'Carla Dias', userPhone: '11923456789', serviceIds: ['manut_20'] },
  { date: '2024-03-28', time: '15:30', userName: 'Olivia Pinto', userPhone: '11933445566', serviceIds: ['epil_rosto'] },
  
  // April 2024
  { date: '2024-04-02', time: '10:30', userName: 'Patrícia Ribeiro', userPhone: '11944556677', serviceIds: ['cilios_boneca'] },
  { date: '2024-04-04', time: '14:00', userName: 'Juliana Castro', userPhone: '11990123456', serviceIds: ['manut_25', 'epil_buco'] },
  { date: '2024-04-09', time: '11:00', userName: 'Quintina Santos', userPhone: '11955667788', serviceIds: ['sob_henna'] },
  { date: '2024-04-11', time: '16:00', userName: 'Rafaela Ferreira', userPhone: '11966778899', serviceIds: ['cilios_egipcio'] },
  { date: '2024-04-16', time: '09:00', userName: 'Sofia Martins', userPhone: '11977889900', serviceIds: ['epil_rosto'] },
  { date: '2024-04-18', time: '13:00', userName: 'Larissa Cunha', userPhone: '11901234567', serviceIds: ['manut_15'] },
  { date: '2024-04-23', time: '15:00', userName: 'Tatiana Nunes', userPhone: '11988990011', serviceIds: ['cilios_classico'] },
  { date: '2024-04-25', time: '10:00', userName: 'Manuela Gomes', userPhone: '11911223344', serviceIds: ['manut_20', 'sob_simples'] },
  { date: '2024-04-30', time: '14:30', userName: 'Ursula Vieira', userPhone: '11999001122', serviceIds: ['sob_henna'] },
];

const processMockData = (allServices: Service[]): BookedSlot[] => {
    return MOCK_BOOKINGS_DATA.map(mock => {
        const services = mock.serviceIds
            .map(id => allServices.find(s => s.id === id))
            .filter((s): s is Service => s !== undefined);

        const baseDuration = services.reduce((acc, s) => acc + s.duration, 0);
        const buffer = services.length * 10;
        const duration = baseDuration + buffer;

        return { ...mock, services, duration };
    });
};


export const seedInitialData = () => {
    const SEED_FLAG_KEY = 'herica-studio-seeded-v3';
    try {
        // First, ensure services are initialized
        const allServices = getServices();

        const hasBeenSeeded = localStorage.getItem(SEED_FLAG_KEY);
        if (hasBeenSeeded) {
            return;
        }

        const processedBookings = processMockData(allServices);
        localStorage.setItem('bellaStudioBookedSlots', JSON.stringify(processedBookings));
        localStorage.setItem(SEED_FLAG_KEY, 'true');

    } catch (error) {
        console.error("Failed to seed data", error);
    }
};
