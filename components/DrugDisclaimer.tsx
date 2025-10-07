import React from 'react';
import { AlertTriangleIcon } from './Icons';

const DrugDisclaimer: React.FC = () => {
  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/40 border-l-4 border-amber-400 dark:border-amber-500 p-4 rounded-r-lg shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangleIcon className="w-8 h-8 text-amber-500 dark:text-amber-400 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
            PERINGATAN PENTING MENGENAI INFORMASI OBAT
          </h3>
          <ul className="list-disc list-inside mt-2 space-y-1 text-amber-700 dark:text-amber-300">
            <li>Informasi ini <strong>BUKAN resep</strong>, melainkan contoh untuk tujuan edukasi.</li>
            <li>Nama obat yang disebut adalah contoh umum dan <strong>belum tentu cocok atau aman</strong> untuk Anda.</li>
            <li className="font-bold">
              JANGAN MEMBELI ATAU MENGONSUMSI OBAT apa pun tanpa pemeriksaan dan resep dari dokter.
            </li>
            <li>Kesalahan dalam penggunaan obat dapat berakibat fatal dan berbahaya.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DrugDisclaimer;
