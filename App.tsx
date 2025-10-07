
import React, { useState, useCallback, useEffect } from 'react';
import { Sender, type Message } from './types';
import { INITIAL_PROMPT, EMERGENCY_KEYWORDS } from './constants';
import { generateAiResponse, generateAssessmentPlan } from './services/geminiService';
import Disclaimer from './components/Disclaimer';
import ChatWindow from './components/ChatWindow';
import { fileToBase64 } from './utils/fileUtils';
import ImageModal from './components/ImageModal';

const LOCAL_STORAGE_KEY = 'chatSession';

// Fungsi pengganti untuk crypto.randomUUID() yang bekerja di konteks tidak aman (non-HTTPS)
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export default function App() {
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSession) {
        const { messages: savedMessages, sessionStarted: savedSessionStarted, isEmergencyActive: savedIsEmergencyActive } = JSON.parse(savedSession);
        if (savedMessages && savedSessionStarted) {
          setMessages(savedMessages);
          setSessionStarted(savedSessionStarted);
          setIsEmergencyActive(savedIsEmergencyActive || false);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to load chat session from localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (sessionStarted) {
      try {
        const sessionToSave = {
          messages,
          sessionStarted,
          isEmergencyActive,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionToSave));
      } catch (error) {
        console.error("Failed to save chat session to localStorage", error);
      }
    }
  }, [messages, sessionStarted, isEmergencyActive]);

  useEffect(() => {
    if (sessionStarted && messages.length === 0) {
      setMessages([
        {
          id: 'initial-ai-message',
          sender: Sender.AI,
          text: INITIAL_PROMPT,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [sessionStarted, messages.length]);

  const handleSendMessage = async (text: string, file?: File) => {
    if (isLoading || isEmergencyActive) return;

    const userMessageText = text.trim();
    if (!userMessageText && !file) return;

    const imageBase64 = file ? await fileToBase64(file) : undefined;
    const userMessage: Message = {
      id: generateUniqueId(),
      sender: Sender.User,
      text: userMessageText,
      image: imageBase64,
      timestamp: new Date().toISOString(),
    };
    
    const newMessagesWithUser = [...messages, userMessage];
    setMessages(newMessagesWithUser);

    const isEmergency = EMERGENCY_KEYWORDS.some(keyword =>
      userMessageText.toLowerCase().includes(keyword)
    );

    if (isEmergency) {
      const emergencySystemMessage: Message = {
        id: generateUniqueId(),
        sender: Sender.System,
        text: 'Emergency detected. Displaying warning.',
        isEmergency: true,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, emergencySystemMessage]);
      setIsEmergencyActive(true);
      return;
    }

    setIsLoading(true);

    try {
      // FIX: `generateAiResponse` expects only one argument (the messages array).
      const aiResponse = await generateAiResponse(newMessagesWithUser);
      const aiMessage: Message = {
        id: generateUniqueId(),
        sender: Sender.AI,
        text: aiResponse.text,
        image: aiResponse.imageUrl,
        containsDrugInfo: aiResponse.containsDrugInfo,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessagesWithUser, aiMessage];
      
      const userMessagesCount = finalMessages.filter(m => m.sender === Sender.User).length;
      if (userMessagesCount >= 3) {
          try {
            const assessmentPlan = await generateAssessmentPlan(finalMessages);
            const planMessage: Message = {
                id: generateUniqueId(),
                sender: Sender.AI,
                text: "Berikut adalah ringkasan dan rencana saran berdasarkan percakapan kita. Ingat, ini bukan diagnosis medis.",
                assessment: assessmentPlan,
                timestamp: new Date().toISOString(),
            };
            setMessages([...finalMessages, planMessage]);
          } catch(e) {
            console.error("Failed to generate assessment plan:", e);
            setMessages(finalMessages);
          }
      } else {
        setMessages(finalMessages);
      }
    } catch (error)
     {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: generateUniqueId(),
        sender: Sender.System,
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSession = () => {
    setSessionStarted(true);
  };

  const handleClearChat = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus riwayat obrolan? Tindakan ini tidak bisa dibatalkan.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setIsEmergencyActive(false);
      setMessages([
        {
          id: 'initial-ai-message-cleared',
          sender: Sender.AI,
          text: INITIAL_PROMPT,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-slate-200 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 w-full h-screen flex flex-col items-center justify-center p-0 md:p-4">
        <div className="w-full h-full md:w-full lg:w-3/4 xl:w-1/2 max-w-4xl flex flex-col bg-slate-100 dark:bg-slate-800/50 shadow-2xl md:rounded-lg relative">
            {!sessionStarted ? (
                <Disclaimer onAgree={handleStartSession} />
            ) : (
                <ChatWindow
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    isInputDisabled={isEmergencyActive}
                    onImageClick={openImageModal}
                    onClearChat={handleClearChat}
                />
            )}
        </div>
        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />}
    </div>
  );
}
