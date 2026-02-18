
import React from 'react';
import { Service } from '../types';
import { DEFAULT_SERVICES } from '../initialServices';
import { EyeIcon, SparklesIcon, FaceSmileIcon, WrenchScrewdriverIcon, Cog6ToothIcon } from '../components/icons';

const SERVICES_STORAGE_KEY = 'hericaStudioServices';

// Helper to strip icon before saving to localStorage
const stripIcon = (service: Service): Omit<Service, 'icon'> => {
    const { icon, ...rest } = service;
    return rest;
};

const getIconForCategory = (category: string): React.ReactNode => {
    const catLower = category.toLowerCase();
    // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
    if (catLower.includes('cílios')) return React.createElement(EyeIcon);
    if (catLower.includes('sobrancelha')) return React.createElement(SparklesIcon);
    if (catLower.includes('epilação')) return React.createElement(FaceSmileIcon);
    if (catLower.includes('manutenção')) return React.createElement(WrenchScrewdriverIcon);
    return React.createElement(Cog6ToothIcon);
};

export const getServices = (): Service[] => {
    try {
        const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
        if (storedServices) {
            return JSON.parse(storedServices).map((s: Service) => ({
                ...s,
                icon: getIconForCategory(s.category),
            }));
        }
        // If no services in storage, initialize with defaults
        localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(DEFAULT_SERVICES.map(stripIcon)));
        return DEFAULT_SERVICES;
    } catch (error) {
        console.error("Failed to parse services from localStorage", error);
        return DEFAULT_SERVICES;
    }
};

export const addService = (newServiceData: Omit<Service, 'id' | 'icon'>): Service => {
    const currentServices = getServices().map(stripIcon);
    
    const newService: Omit<Service, 'icon'> = {
        ...newServiceData,
        id: `${newServiceData.category.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`,
    };

    const updatedServices = [...currentServices, newService];
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updatedServices));

    return { ...newService, icon: getIconForCategory(newService.category) };
};

export const updateService = (updatedService: Omit<Service, 'icon'>): void => {
    const currentServices = getServices().map(stripIcon);
    const serviceIndex = currentServices.findIndex(s => s.id === updatedService.id);

    if (serviceIndex > -1) {
        currentServices[serviceIndex] = updatedService;
        localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(currentServices));
    }
};

export const deleteService = (serviceId: string): void => {
    const currentServices = getServices().map(stripIcon);
    const updatedServices = currentServices.filter(s => s.id !== serviceId);
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updatedServices));
}
