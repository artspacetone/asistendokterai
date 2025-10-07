
import React from 'react';
import { InfoIcon } from './Icons';

interface FinalDisclaimerProps {
    text: string;
}

const FinalDisclaimer: React.FC<FinalDisclaimerProps> = ({ text }) => {
  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/40 border-l-4 border-amber-400 dark:border-amber-500 p-4 rounded-r-lg shadow-sm mt-4">
      <div className="flex items-start gap-3">
        <InfoIcon className="w-8 h-8 text-amber-500 dark:text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-amber-800 dark:text-amber-200 font-semibold whitespace-pre-wrap text-justify">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalDisclaimer;
