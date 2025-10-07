
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
            <h3 className="text-lg font-semibold flex items-center mb-2">
                {icon}
                <span className="ml-2">{title}</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700 dark:text-slate-300">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};


const AssessmentPlanComponent: React.FC<AssessmentPlanProps> = ({ assessmentPlan }) => {
  return (
    <div className="mt-4 border-t border-slate-300 dark:border-slate-600 pt-4 space-y-6">
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
