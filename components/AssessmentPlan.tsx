
import React from 'react';
import { type AssessmentPlan } from '../types';
import { ClipboardListIcon, BeakerIcon, ArrowRightIcon } from './Icons';

interface AssessmentPlanProps {
  assessmentPlan: AssessmentPlan;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; items: string[] }> = ({ title, icon, items }) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h3 className="text-lg font-semibold flex items-center mb-2 text-slate-800 dark:text-slate-100">
                {icon}
                <span className="ml-2">{title}</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-300 text-justify">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};


const AssessmentPlanComponent: React.FC<AssessmentPlanProps> = ({ assessmentPlan }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl shadow-sm p-4 space-y-6">
       <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-600 pb-2">
         Ringkasan & Rencana Saran
       </h2>
      <Section 
        title="Kemungkinan Penilaian"
        icon={<BeakerIcon className="w-6 h-6 text-sky-500" />}
        items={assessmentPlan.assessment}
      />
      <Section 
        title="Rencana Saran"
        icon={<ClipboardListIcon className="w-6 h-6 text-emerald-500" />}
        items={assessmentPlan.plan}
      />
      <Section 
        title="Langkah Selanjutnya"
        icon={<ArrowRightIcon className="w-6 h-6 text-amber-500" />}
        items={assessmentPlan.nextSteps}
      />
    </div>
  );
};

export default AssessmentPlanComponent;
