import React, { useEffect, useRef } from 'react';
import { type Message, Sender } from '../types';
import MessageComponent from './Message';
import MessageInput from './MessageInput';
import EmergencyMessage from './EmergencyMessage';
import { TrashIcon } from './Icons';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string, file?: File) => void;
  isLoading: boolean;
  isInputDisabled: boolean;
  onImageClick: (imageUrl: string) => void;
  onClearChat: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, isInputDisabled, onImageClick, onClearChat }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 md:rounded-lg">
      <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm flex-shrink-0">
         <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Asisten Dokter AI</h1>
                <p className="text-sm text-emerald-500 flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>Online</p>
            </div>
         </div>
         <button 
            onClick={onClearChat}
            className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            title="Hapus riwayat obrolan"
            aria-label="Clear chat history"
            >
             <TrashIcon className="w-6 h-6" />
         </button>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-900/50">
        {messages.map((msg) => (
            msg.isEmergency && msg.sender === Sender.System
            ? <EmergencyMessage key={msg.id} />
            : <MessageComponent key={msg.id} message={msg} onImageClick={onImageClick} />
        ))}
        {isLoading && <MessageComponent isLoading={true} />}
        <div ref={messagesEndRef} />
      </main>
      <MessageInput onSendMessage={onSendMessage} disabled={isLoading || isInputDisabled} />
    </div>
  );
};

export default ChatWindow;
