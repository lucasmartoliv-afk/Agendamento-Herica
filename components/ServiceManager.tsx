
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { getServices, addService, updateService, deleteService } from '../utils/serviceUtils';
import { Service } from '../types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from './icons';

const initialFormState: Omit<Service, 'id' | 'icon'> = {
    category: '',
    name: '',
    description: '',
    price: 0,
    duration: 0,
    photo: '',
};

export const ServiceManager: React.FC = () => {
    const [services, setServices] = useState<Service[]>(getServices());
    const [formData, setFormData] = useState(initialFormState);
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    const [recentlyDeleted, setRecentlyDeleted] = useState<Omit<Service, 'icon'> | null>(null);
    const undoTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (undoTimeoutRef.current) {
                clearTimeout(undoTimeoutRef.current);
            }
        };
    }, []);
    
    const serviceCategories = useMemo(() => {
        const categories = services.reduce((acc, service) => {
            (acc[service.category] = acc[service.category] || []).push(service);
            return acc;
        }, {} as Record<string, Service[]>);
        return Object.entries(categories).sort(([a], [b]) => a.localeCompare(b));
    }, [services]);
    
    const existingCategories = useMemo(() => [...new Set(services.map(s => s.category))].sort(), [services]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? parseFloat(value) || 0 : value,
        }));
    };

     const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'NEW') {
            setIsAddingNewCategory(true);
            setFormData(prev => ({ ...prev, category: '' }));
        } else {
            setIsAddingNewCategory(false);
            setFormData(prev => ({ ...prev, category: e.target.value }));
        }
    };
    
    const resetFormState = () => {
        setFormData(initialFormState);
        setEditingServiceId(null);
        setIsAddingNewCategory(false);
    };

    const handleAddNewClick = () => {
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        setRecentlyDeleted(null);
        resetFormState();
        setShowForm(true);
    };

    const handleEditClick = (service: Service) => {
        const { icon, ...serviceData } = service;
        setEditingServiceId(service.id);
        setFormData(serviceData);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleUndoDelete = () => {
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        if (recentlyDeleted) {
            setServices(getServices());
            setRecentlyDeleted(null);
        }
    };

    const handleDeleteClick = (serviceId: string) => {
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        
        const serviceToDelete = services.find(s => s.id === serviceId);
        if (!serviceToDelete) return;

        const { icon, ...serviceData } = serviceToDelete;
        setRecentlyDeleted(serviceData);
        
        setServices(currentServices => currentServices.filter(s => s.id !== serviceId));

        undoTimeoutRef.current = window.setTimeout(() => {
            deleteService(serviceId);
            setRecentlyDeleted(null);
        }, 7000);
    };
    
    const handleCancelForm = () => {
        resetFormState();
        setShowForm(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.price >= 0 && formData.duration > 0 && formData.name && formData.category) {
            if (editingServiceId) {
                updateService({ ...formData, id: editingServiceId });
            } else {
                addService(formData);
            }
            setServices(getServices());
            handleCancelForm();
        }
    };

    const isFormValid = formData.name && formData.category && formData.duration > 0 && formData.price >= 0;
    
    return (
        <div className="space-y-8 animate-fade-in">
             <button 
                onClick={handleAddNewClick}
                className="flex items-center justify-center gap-2 w-full bg-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
                <PlusCircleIcon />
                Novo Serviço
            </button>
            
            {showForm && (
                <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border animate-fade-in-fast">
                    <h3 className="font-bold text-gray-800 mb-4">{editingServiceId ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                                <select name="category" value={isAddingNewCategory ? 'NEW' : formData.category} onChange={handleCategoryChange} className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500">
                                    <option value="">Selecione...</option>
                                    {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="NEW">-- Nova Categoria --</option>
                                </select>
                            </div>
                            {isAddingNewCategory && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome da Nova Categoria</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
                                </div>
                            )}
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Duração (minutos)</label>
                                <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Foto do Serviço (Opcional)</label>
                            <input type="file" accept="image/png, image/jpeg" onChange={handlePhotoChange} className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>
                            {formData.photo && <img src={formData.photo} alt="Preview" className="w-24 h-24 mt-2 rounded-lg object-cover shadow-sm" />}
                        </div>
                         <div className="flex gap-4 pt-4 border-t">
                             <button type="submit" disabled={!isFormValid} className="bg-pink-500 text-white font-bold py-2 px-6 rounded-lg transition-colors hover:bg-pink-600 disabled:bg-gray-300">Salvar</button>
                             <button type="button" onClick={handleCancelForm} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                         </div>
                    </form>
                </div>
            )}
             <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
                <h3 className="font-bold text-gray-800 mb-4">Serviços Atuais</h3>
                <div className="space-y-4">
                    {serviceCategories.map(([category, servicesInCategory]) => (
                        <div key={category}>
                            <h4 className="font-semibold text-pink-700">{category}</h4>
                            <ul className="mt-2 space-y-2">
                                {servicesInCategory.map(service => (
                                    <li key={service.id} className="flex justify-between items-center text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50">
                                        <div className="flex items-center gap-3 flex-grow">
                                            {service.photo ? (
                                                <img src={service.photo} alt={service.name} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0"></div>
                                            )}
                                            <div className="flex-grow">
                                                <span className="font-semibold text-gray-800">{service.name}</span>
                                                <p className="text-xs text-gray-500">{service.duration} min</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-pink-600 text-sm min-w-[70px] text-right">R${service.price.toFixed(2)}</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleEditClick(service)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"><PencilIcon/></button>
                                                <button onClick={() => handleDeleteClick(service.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon/></button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
             </div>
             {recentlyDeleted && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in z-50">
                    <span>Serviço "{recentlyDeleted.name}" excluído.</span>
                    <button onClick={handleUndoDelete} className="font-semibold underline hover:text-gray-200">Desfazer</button>
                </div>
            )}
        </div>
    );
}
