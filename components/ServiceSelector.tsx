
import React, { useState, useMemo } from 'react';
import { Service } from '../types';
import { getServices } from '../utils/serviceUtils';

interface ServiceSelectorProps {
  selectedServices: Service[];
  onToggleService: (service: Service) => void;
  onNext: () => void;
}

const ServiceCard: React.FC<{ service: Service; onSelect: () => void; isSelected: boolean, isDisabled: boolean }> = ({ service, onSelect, isSelected, isDisabled }) => {
    const handleSelect = () => {
        if (!isDisabled) {
            onSelect();
        }
    };
    
    return (
        <div
            onClick={handleSelect}
            className={`w-full text-left p-4 bg-white rounded-xl shadow-md flex items-center space-x-4 transition-all duration-300 ease-in-out border-2  ${
                isSelected ? 'border-pink-500 scale-105' : 'border-transparent'
            } ${
                isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:shadow-lg hover:scale-105'
            }`}
        >
            {service.photo ? (
                <img src={service.photo} alt={service.name} className="flex-shrink-0 w-12 h-12 rounded-full object-cover" />
            ) : (
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center">
                    {service.icon}
                </div>
            )}
            <div className="flex-grow">
            <h3 className="font-semibold text-gray-800">{service.name}</h3>
            <p className="text-sm text-gray-500">{service.description}</p>
            </div>
            <div className="text-right">
            <p className="font-bold text-pink-600">R${service.price.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{service.duration} min</p>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-pink-500 border-pink-500' : 'border-gray-300'}`}>
                {isSelected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
            </div>
        </div>
    );
};

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ selectedServices, onToggleService, onNext }) => {
  const allServices = useMemo(() => getServices(), []);
  
  const serviceCategories = useMemo(() => {
    return allServices.reduce((acc, service) => {
      (acc[service.category] = acc[service.category] || []).push(service);
      return acc;
    }, {} as Record<string, Service[]>);
  }, [allServices]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(Object.keys(serviceCategories)[0]);

  const totalPrice = useMemo(() => selectedServices.reduce((acc, s) => acc + s.price, 0), [selectedServices]);
  const totalDuration = useMemo(() => {
    if (selectedServices.length === 0) return 0;
    const baseDuration = selectedServices.reduce((total, service) => total + service.duration, 0);
    const buffer = selectedServices.length * 10;
    return baseDuration + buffer;
  }, [selectedServices]);

  const hasExtensionSelected = useMemo(() => selectedServices.some(s => s.category === 'Extensão de Cílios'), [selectedServices]);
  const hasMaintenanceSelected = useMemo(() => selectedServices.some(s => s.category === 'Manutenção de Cílios'), [selectedServices]);


  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Escolha os Serviços</h2>
        <p className="text-center text-gray-500 mb-6">Você pode escolher um tipo de extensão OU manutenção.</p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.keys(serviceCategories).map(category => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                        selectedCategory === category
                            ? 'bg-pink-500 text-white shadow'
                            : 'bg-white text-gray-700 hover:bg-pink-100'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>

        {selectedCategory && (
            <div className="space-y-4 animate-fade-in-fast max-h-80 overflow-y-auto pr-2">
                {serviceCategories[selectedCategory].map(service => {
                    const isDisabled = (service.category === 'Manutenção de Cílios' && hasExtensionSelected) || (service.category === 'Extensão de Cílios' && hasMaintenanceSelected);
                    return (
                        <ServiceCard 
                            key={service.id} 
                            service={service} 
                            onSelect={() => onToggleService(service)}
                            isSelected={selectedServices.some(s => s.id === service.id)}
                            isDisabled={isDisabled}
                        />
                    );
                })}
            </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
            {selectedServices.length > 0 ? (
                <div className="animate-fade-in-fast">
                    <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                        <span>Total</span>
                        <div>
                            <span>{totalDuration} min</span>
                            <span className="mx-2">/</span>
                            <span className="text-pink-600">R${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">
                        *Tempo inclui 10 min de tolerância por serviço.
                    </p>
                     <button 
                        onClick={onNext}
                        className="mt-4 w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                        Escolher Data e Hora
                    </button>
                </div>
            ) : (
                <p className="text-center text-gray-500">Selecione ao menos um serviço para continuar.</p>
            )}
        </div>
    </div>
  );
};
