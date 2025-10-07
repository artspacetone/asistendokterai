
import React from 'react';
import { ShieldCheckIcon } from './Icons';

interface DisclaimerProps {
  onAgree: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onAgree }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 md:p-12 bg-white dark:bg-slate-800 text-center">
      <ShieldCheckIcon className="w-24 h-24 text-sky-500 mb-6" />
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Persetujuan Pengguna</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-2xl text-justify">
        Asisten Dokter AI ini adalah layanan berbasis kecerdasan buatan dan <strong>bukan pengganti nasihat medis profesional</strong>. Informasi yang diberikan hanya untuk tujuan edukasi.
      </p>
      <div className="text-left max-w-2xl w-full bg-slate-50 dark:bg-slate-700 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Harap Diperhatikan:</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 text-justify">
          <li>Layanan ini tidak memberikan diagnosis medis.</li>
          <li>Jangan gunakan layanan ini dalam situasi darurat medis.</li>
          <li>Segala keputusan terkait kesehatan Anda harus dibuat setelah berkonsultasi dengan dokter atau tenaga medis profesional.</li>
        </ul>
      </div>
      <button
        onClick={onAgree}
        className="mt-10 px-8 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
      >
        Saya Mengerti dan Setuju
      </button>
    </div>
  );
};

export default Disclaimer;
