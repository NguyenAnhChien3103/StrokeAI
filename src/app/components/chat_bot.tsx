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
          webhookUrl: 'https://ronmanhwa.app.n8n.cloud/webhook/c06e7c6d-be67-4e4b-ac71-3781fdaea258/chat'
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