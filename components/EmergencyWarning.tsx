
import React from 'react';
import { AlertTriangleIcon } from './Icons';

interface EmergencyWarningProps {
    onClose: () => void;
}

const EmergencyWarning: React.FC<EmergencyWarningProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-lg w-full text-center p-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 mb-6">
                    <AlertTriangleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-3xl font-extrabold text-red-700 dark:text-red-300 mb-4">DARURAT MEDIS TERDETEKSI</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg">
                    Gejala yang Anda sebutkan mungkin mengindikasikan kondisi medis yang serius.
                </p>
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg text-left mb-8">
                    <p className="font-bold text-red-800 dark:text-red-200">
                        Harap segera cari pertolongan medis profesional.
                    </p>
                    <p className="text-red-700 dark:text-red-300">
                        Hubungi nomor darurat <strong>119</strong> atau kunjungi Unit Gawat Darurat (UGD) terdekat.
                    </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                    Asisten AI ini tidak dapat memberikan bantuan dalam situasi darurat.
                </p>
                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-slate-600 text-white font-bold rounded-lg shadow-lg hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
                >
                    Saya Mengerti
                </button>
            </div>
        </div>
    );
};

export default EmergencyWarning;
