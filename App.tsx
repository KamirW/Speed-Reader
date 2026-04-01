import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen } from './components/SplashScreen';
import { BookLibrary } from './components/BookLibrary';
import { Reader } from './components/Reader';
import { WelcomeScreen } from './components/WelcomeScreen';

const queryClient = new QueryClient();


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

function AppContent() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(300);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [showLibrary, setShowLibrary] = useState<boolean>(false);
  const [currentBookTitle, setCurrentBookTitle] = useState<string>('');
  const intervalRef = useRef<number | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'text/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const response = await fetch(asset.uri);
        const textContent = await response.text();
        const wordArray = textContent.trim().split(/\s+/).filter(word => word.length > 0);
        setWords(wordArray);
        setCurrentWordIndex(0);
        setHasStarted(true);
        setIsReading(false);
        setCurrentBookTitle(asset.name || 'Uploaded File');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleBookSelect = (content: string, title: string) => {
    const wordArray = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWords(wordArray);
    setCurrentWordIndex(0);
    setHasStarted(true);
    setIsReading(false);
    setCurrentBookTitle(title);
    setShowLibrary(false);
  };

  const handleBackToMenu = () => {
    setHasStarted(false);
    setShowLibrary(false);
    setWords([]);
    setCurrentWordIndex(0);
    setIsReading(false);
    setCurrentBookTitle('');
  };

  useEffect(() => {
    if (isReading && currentWordIndex < words.length - 1) {
      const interval = 60000 / wpm;
      intervalRef.current = setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
      }, interval);
    } else if (currentWordIndex >= words.length - 1) {
      setIsReading(false);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isReading, currentWordIndex, wpm, words.length]);

  const toggleReading = () => {
    setIsReading(!isReading);
  };

  const resetReading = () => {
    setIsReading(false);
    setCurrentWordIndex(0);
  };

  if (showSplashScreen) {
    return <SplashScreen onFinish={() => setShowSplashScreen(false)} />;
  }

  if (showLibrary) {
    return (
      <BookLibrary 
        onBookSelect={handleBookSelect}
        onBack={() => setShowLibrary(false)}
      />
    );
  }

  if (hasStarted) {
    return (
      <Reader
        words={words}
        currentWordIndex={currentWordIndex}
        isReading={isReading}
        wpm={wpm}
        currentBookTitle={currentBookTitle}
        onBackToMenu={handleBackToMenu}
        onToggleReading={toggleReading}
        onResetReading={resetReading}
        onWpmChange={setWpm}
        onPickDocument={pickDocument}
      />
    );
  }

  return (
    <WelcomeScreen
      onPickDocument={pickDocument}
      onShowLibrary={() => setShowLibrary(true)}
    />
  );
};
