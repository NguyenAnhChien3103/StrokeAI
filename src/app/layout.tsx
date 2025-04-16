"use client";

import "./globals.css";
import { Inter } from 'next/font/google';
import Header from "./components/header";
import Footer from "./components/footer";
import ChatBot from "./components/chat_bot";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <ChatBot />
        <Footer />
      </body>
    </html>
  );
}
