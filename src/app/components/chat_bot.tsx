"use client";

import { useEffect } from 'react';

export default function ChatBot() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
    script.type = 'module';
    
    script.onload = () => {
      const initChat = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        createChat({
          webhookUrl: 'https://workflow.makeai.vn/webhook/9f8e4a1a-3c19-48e1-ad90-f1efed1d7dce/chat'
        });
      `;
      
      const initScript = document.createElement('script');
      initScript.type = 'module';
      initScript.textContent = initChat;
      document.body.appendChild(initScript);
    };

    document.body.appendChild(script);
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return null;
} 