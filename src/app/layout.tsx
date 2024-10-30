'use client';
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from 'react-redux';
import store from "@/store/store";
import { useState, useEffect } from 'react';
import Image from 'next/image';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    const newMode = !isDarkMode;
    localStorage.setItem('darkMode', String(newMode));
    document.body.classList.toggle('dark', newMode);
  };

  return (
    <Provider store={store}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <button 
            onClick={toggleDarkMode} 
            className="fixed top-4 right-4 p-2 bg-transparent rounded-md focus:outline-none transition duration-300"
            aria-label="Toggle Dark Mode"
          >
            <Image 
              src="/darkmode.png" 
              alt={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} 
              width={34}
              height={34}
              className="h-6 w-6 dark:invert"
              // priority
            />
          </button>
          {children}
        </body>
      </html>
    </Provider>
  );
}
