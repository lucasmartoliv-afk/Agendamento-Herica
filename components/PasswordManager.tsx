import React, { useState } from 'react';
import { getAdminPassword, setAdminPassword } from '../utils/adminUtils';
import { ShieldCheckIcon } from './icons';

export const PasswordManager: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 1. Validate current password
        if (currentPassword !== getAdminPassword()) {
            setError('A senha atual está incorreta.');
            return;
        }

        // 2. Check if new passwords are provided and match
        if (!newPassword || newPassword !== confirmPassword) {
            setError('As novas senhas não correspondem ou estão em branco.');
            return;
        }
        
        // 3. Check if new password is same as old
        if (newPassword === getAdminPassword()) {
            setError('A nova senha não pode ser igual à antiga.');
            return;
        }

        // 4. Save the new password
        setAdminPassword(newPassword);
        setSuccess('Senha alterada com sucesso!');

        // 5. Clear fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        setTimeout(() => setSuccess(''), 3000);
    };

    const isFormValid = currentPassword && newPassword && confirmPassword && newPassword === confirmPassword;

    return (
        <div className="animate-fade-in">
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-4">
                     <ShieldCheckIcon />
                    <h3 className="font-bold text-gray-800">Alterar Senha de Acesso</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                        <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            required
                        />
                    </div>

                    <div className="pt-2 flex items-center gap-4">
                        <button type="submit" disabled={!isFormValid} className="bg-pink-500 text-white font-bold py-2 px-6 rounded-lg transition-colors hover:bg-pink-600 disabled:bg-gray-300">
                            Salvar Alterações
                        </button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-600 text-sm">{success}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};
