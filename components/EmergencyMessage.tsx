
import React from 'react';
import { AlertTriangleIcon } from './Icons';

const EmergencyMessage: React.FC = () => {
    return (
        <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-6 rounded-r-lg shadow-md my-4 flex items-start gap-4">
            <AlertTriangleIcon className="h-10 w-10 text-red-500 flex-shrink-0 mt-1" />
            <div>
                <h2 className="text-xl font-extrabold text-red-800 dark:text-red-200 mb-2">DARURAT MEDIS TERDETEKSI</h2>
                <p className="mb-4">
                    Gejala yang Anda sebutkan mungkin mengindikasikan kondisi medis yang serius. Asisten AI ini <strong>tidak dapat</strong> memberikan bantuan dalam situasi darurat.
                </p>
                <div className="font-bold border-t border-red-300 dark:border-red-700 pt-4 mt-4">
                    <p>Harap segera cari pertolongan medis profesional.</p>
                    <p>Hubungi nomor darurat <strong>119</strong> atau kunjungi Unit Gawat Darurat (UGD) terdekat.</p>
                </div>
            </div>
        </div>
    );
};

export default EmergencyMessage;
