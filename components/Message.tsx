import React from 'react';
import { type Message, Sender } from '../types';
import { UserIcon, SparklesIcon, SystemIcon } from './Icons';
import AssessmentPlanComponent from './AssessmentPlan';
import DrugDisclaimer from './DrugDisclaimer';
import MarkdownRenderer from './MarkdownRenderer'; // Impor komponen baru

interface MessageProps {
  message?: Message;
  isLoading?: boolean;
  onImageClick?: (imageUrl: string) => void;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5 px-2">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
    </div>
);

const MessageComponent: React.FC<MessageProps> = ({ message, isLoading, onImageClick }) => {
  if (isLoading) {
    return (
      <div className="flex items-start gap-3 justify-start">
        <SparklesIcon className="w-10 h-10 flex-shrink-0" />
        <div className="bg-slate-100 dark:bg-slate-700 rounded-xl rounded-tl-none p-4 max-w-xl shadow-sm">
            <TypingIndicator />
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isUser = message.sender === Sender.User;
  const isSystem = message.sender === Sender.System;
  const isAi = message.sender === Sender.AI;

  const wrapperClass = `flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`;
  
  const Avatar = isUser ? UserIcon : isSystem ? SystemIcon : SparklesIcon;

  // Wrapper for AI message content (bubble + cards)
  const AiContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col items-start gap-3 w-full max-w-2xl">
        {children}
    </div>
  );

  return (
    <div className={wrapperClass}>
      {!isUser && <Avatar className="w-10 h-10 flex-shrink-0" />}
      
      {isAi ? (
        <AiContentWrapper>
          {(message.text || message.image) && (
            <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl rounded-tl-none p-4 shadow-sm w-full">
              {message.image && (
                <button
                  onClick={() => onImageClick && onImageClick(message.image!)}
                  className="block rounded-lg mb-2 max-w-xs h-auto overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-700 focus:ring-sky-500"
                  aria-label="View larger image"
                >
                  <img src={message.image} alt="Uploaded content" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </button>
              )}
              {/* Gunakan MarkdownRenderer di sini */}
              {message.text && <MarkdownRenderer text={message.text} />}
            </div>
          )}
          {message.assessment && <AssessmentPlanComponent assessmentPlan={message.assessment} />}
          {message.containsDrugInfo && <DrugDisclaimer />}
        </AiContentWrapper>
      ) : (
         <div className={`p-4 max-w-xl shadow-sm rounded-xl ${
            isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
        }`}>
          {message.image && (
              <button
                onClick={() => onImageClick && onImageClick(message.image!)}
                className="block rounded-lg mb-2 max-w-xs h-auto overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-sky-500"
                aria-label="View larger image"
              >
                <img src={message.image} alt="Uploaded content" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </button>
          )}
          {message.text && <div className="whitespace-pre-wrap">{message.text}</div>}
        </div>
      )}

      {isUser && <Avatar className="w-10 h-10 flex-shrink-0" />}
    </div>
  );
};

export default MessageComponent;
