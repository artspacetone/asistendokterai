
import React, { useState, useRef, useCallback } from 'react';
import { PaperclipIcon, SendIcon } from './Icons';

interface MessageInputProps {
  onSendMessage: (text: string, file?: File) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSend = useCallback(() => {
    if ((text.trim() || file) && !disabled) {
      onSendMessage(text, file);
      setText('');
      setFile(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [text, file, disabled, onSendMessage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };
  
  const removeFile = () => {
    setFile(undefined);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="relative">
        {file && (
          <div className="absolute bottom-full left-0 w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-t-md">
            <div className="flex items-center justify-between text-sm bg-slate-200 dark:bg-slate-600 p-2 rounded">
              <span className="truncate max-w-[calc(100%-3rem)]">{file.name}</span>
              <button onClick={removeFile} className="text-slate-500 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan Anda di sini..."
          className="w-full p-3 pr-28 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 dark:bg-slate-700 resize-none"
          rows={1}
          disabled={disabled}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            disabled={disabled}
          >
            <PaperclipIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            disabled={disabled}
          />
          <button
            onClick={handleSend}
            disabled={disabled || (!text.trim() && !file)}
            className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-colors"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
