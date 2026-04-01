import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SplashScreen } from './components/SplashScreen';
import { BookLibrary } from './components/BookLibrary';
import { Reader } from './components/Reader';
import { EnhancedHomeScreen } from './components/EnhancedHomeScreen';
import { StorageService, ReadingProgress } from './services/StorageService';

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
  const [currentBookId, setCurrentBookId] = useState<string>('');
  const intervalRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const wordsReadInSessionRef = useRef<number>(0);
  const [preferences, setPreferences] = useState<any>(null);

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await StorageService.getUserPreferences();
        setPreferences(prefs);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    
    loadPreferences();
  }, []);

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
        
        const bookId = `doc_${Date.now()}`;
        const progress: ReadingProgress = {
          id: bookId,
          title: asset.name || 'Uploaded File',
          content: textContent,
          currentWordIndex: 0,
          totalWords: wordArray.length,
          wpm: preferences?.defaultWPM || 300,
          lastReadAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isCompleted: false,
        };
        
        await StorageService.saveReadingProgress(progress);
        setWords(wordArray);
        setCurrentWordIndex(0);
        setHasStarted(true);
        setIsReading(false);
        setCurrentBookTitle(asset.name || 'Uploaded File');
        setCurrentBookId(bookId);
        setWpm(preferences?.defaultWPM || 300);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleBookSelect = async (content: string, title: string) => {
    const wordArray = content.trim().split(/\s+/).filter(word => word.length > 0);

    const bookId = `library_${Date.now()}`;
    const progress: ReadingProgress = {
      id: bookId,
      title: title,
      content: content,
      currentWordIndex: 0,
      totalWords: wordArray.length,
      wpm: preferences?.defaultWPM || 300,
      lastReadAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };

    await StorageService.saveReadingProgress(progress);
    setWords(wordArray);
    setCurrentWordIndex(0);
    setHasStarted(true);
    setIsReading(false);
    setCurrentBookTitle(title);
    setCurrentBookId(bookId);
    setShowLibrary(false);
    setWpm(preferences?.defaultWPM || 300);
  };

  const handleResumeReading = async (progress: ReadingProgress) => {
    const wordArray = progress.content.trim().split(/\s+/).filter(word => word.length > 0);

    setWords(wordArray);
    setCurrentWordIndex(progress.currentWordIndex);
    setHasStarted(true);
    setIsReading(false);
    setCurrentBookTitle(progress.title);
    setCurrentBookId(progress.id);
    setWpm(progress.wpm);
  };

  const handleBookCompleted = async () => {
    if (words.length > 0) {
      const progress: ReadingProgress = {
        id: currentBookId,
        title: currentBookTitle,
        content: words.join(' '),
        currentWordIndex: words.length - 1,
        totalWords: words.length,
        wpm: wpm,
        lastReadAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isCompleted: true,
      };

      await StorageService.saveReadingProgress(progress);

      const sessionTime = (Date.now() - sessionStartTimeRef.current) / 1000 / 60; // minutes
      const wordsRead = words.length;
      await StorageService.recordReadingSession(wordsRead, sessionTime, wpm);
    }
  };

  const handleBackToMenu = async () => {
    if (words.length > 0 && currentWordIndex > 0) {
      const progress: ReadingProgress = {
        id: currentBookId,
        title: currentBookTitle,
        content: words.join(' '),
        currentWordIndex: currentWordIndex,
        totalWords: words.length,
        wpm: wpm,
        lastReadAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isCompleted: false,
      };

      await StorageService.saveReadingProgress(progress);

      const sessionTime = (Date.now() - sessionStartTimeRef.current) / 1000 / 60; // minutes
      const wordsRead = currentWordIndex;
      await StorageService.recordReadingSession(wordsRead, sessionTime, wpm);
    }

    setHasStarted(false);
    setShowLibrary(false);
    setWords([]);
    setCurrentWordIndex(0);
    setIsReading(false);
    setCurrentBookTitle('');
    setCurrentBookId('');
    wordsReadInSessionRef.current = 0;
  };

  useEffect(() => {
    if (isReading && currentWordIndex < words.length - 1) {
      const interval = 60000 / wpm;
      intervalRef.current = setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
        wordsReadInSessionRef.current += 1;
      }, interval);
    } else if (currentWordIndex >= words.length - 1) {
      setIsReading(false);
      // Mark book as completed when reaching the end
      handleBookCompleted();
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isReading, currentWordIndex, wpm, words.length]);

  // Auto-save progress every 10 words or when stopping
  useEffect(() => {
    const saveProgress = async () => {
      if (words.length > 0 && currentWordIndex > 0) {
        const progress: ReadingProgress = {
          id: currentBookId,
          title: currentBookTitle,
          content: words.join(' '),
          currentWordIndex: currentWordIndex,
          totalWords: words.length,
          wpm: wpm,
          lastReadAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isCompleted: currentWordIndex >= words.length - 1,
        };

        await StorageService.saveReadingProgress(progress);
      }
    };

    // Save when reading stops or every 10 words
    if (!isReading && currentWordIndex > 0) {
      saveProgress();
    } else if (currentWordIndex > 0 && currentWordIndex % 10 === 0) {
      saveProgress();
    }
  }, [currentWordIndex, isReading, words.length, currentBookId, currentBookTitle, wpm]);

  const handleOnboardingFinish = async () => {
    console.log('handleOnboardingFinish called');
    try {
      await StorageService.updateUserPreferences({ hasCompletedOnboarding: true });
      console.log('Preferences updated successfully');
    } catch (error) {
      console.error('Error in handleOnboardingFinish:', error);
    }
  };

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
    <LinearGradient colors={['#1a1a2e', '#0f0f1e', '#16213e']} style={{ flex: 1 }}>
      <EnhancedHomeScreen
        onPickDocument={pickDocument}
        onShowLibrary={() => setShowLibrary(true)}
        onResumeReading={handleResumeReading}
      />
    </LinearGradient>
  );
};
