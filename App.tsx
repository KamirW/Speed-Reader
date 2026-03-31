import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WordDisplay } from './components/WordDisplay';
import { SplashScreen } from './components/SplashScreen';


export default function App() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(300);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);

  const wpmOptions = [100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800];

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
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
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

  const currentWord = words[currentWordIndex] || '';

  if(showSplashScreen) {
    return <SplashScreen onFinish={() => setShowSplashScreen(false)} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a1a2e', '#0f0f1e', '#16213e']}
        style={styles.gradient}
      >
        {!hasStarted ? (
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Speed Reader</Text>
            <Text style={styles.subtitle}>Transform your reading speed with focus</Text>

            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Text style={styles.uploadButtonText}>Upload Text File</Text>
            </TouchableOpacity>

            <Text style={styles.instructions}>
              Upload a .txt file to begin your speed reading journey
            </Text>
          </View>
        ) : (
          <View style={styles.readerContainer}>
            <View style={styles.header}>
              <Text style={styles.progressText}>
                Word {currentWordIndex + 1} of {words.length}
              </Text>
              <Text style={styles.wpmText}>{wpm} WPM</Text>
            </View>

            <View style={styles.wordDisplayContainer}>
              <WordDisplay word={currentWord} isAnimating={isReading || currentWordIndex === 0} />
            </View>

            <View style={styles.controlsContainer}>
              <View style={styles.wpmSelector}>
                <Text style={styles.wpmLabel}>Reading Speed</Text>
                <View style={styles.wpmButtons}>
                  {wpmOptions.map((speed) => (
                    <TouchableOpacity
                      key={speed}
                      style={[
                        styles.wpmButton,
                        wpm === speed && styles.wpmButtonActive
                      ]}
                      onPress={() => setWpm(speed)}
                    >
                      <Text style={[
                        styles.wpmButtonText,
                        wpm === speed && styles.wpmButtonTextActive
                      ]}>
                        {speed}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.secondaryButton} onPress={resetReading}>
                  <Text style={styles.secondaryButtonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, !isReading && styles.primaryButtonPlay]}
                  onPress={toggleReading}
                >
                  <Text style={styles.primaryButtonText}>
                    {isReading ? 'Pause' : 'Play'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={pickDocument}>
                  <Text style={styles.secondaryButtonText}>New File</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#b0b0c0',
    marginBottom: 60,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#4a69bd',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  instructions: {
    color: '#808090',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  readerContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressText: {
    color: '#b0b0c0',
    fontSize: 16,
  },
  wpmText: {
    color: '#4a69bd',
    fontSize: 16,
    fontWeight: '600',
  },
  wordDisplayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  controlsContainer: {
    paddingBottom: 60,
  },
  wpmSelector: {
    marginBottom: 40,
  },
  wpmLabel: {
    color: '#b0b0c0',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  wpmButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  wpmButton: {
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  wpmButtonActive: {
    backgroundColor: '#4a69bd',
  },
  wpmButtonText: {
    color: '#808090',
    fontSize: 14,
    fontWeight: '500',
  },
  wpmButtonTextActive: {
    color: '#ffffff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20,
  },
  primaryButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonPlay: {
    backgroundColor: '#4a69bd',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#b0b0c0',
    fontSize: 14,
    fontWeight: '500',
  },
});
