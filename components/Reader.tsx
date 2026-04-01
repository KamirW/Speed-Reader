import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WordDisplay } from './WordDisplay';

interface ReaderProps {
  words: string[];
  currentWordIndex: number;
  isReading: boolean;
  wpm: number;
  currentBookTitle: string;
  onBackToMenu: () => void;
  onToggleReading: () => void;
  onResetReading: () => void;
  onWpmChange: (wpm: number) => void;
  onPickDocument: () => void;
}

const wpmOptions = [100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800];

export function Reader({
  words,
  currentWordIndex,
  isReading,
  wpm,
  currentBookTitle,
  onBackToMenu,
  onToggleReading,
  onResetReading,
  onWpmChange,
  onPickDocument,
}: ReaderProps) {
  const currentWord = words[currentWordIndex] || '';

  return (
    <LinearGradient
      colors={['#1a1a2e', '#0f0f1e', '#16213e']}
      style={styles.gradient}
    >
      <View style={styles.readerContainer}>
        <View style={styles.header}>
        <TouchableOpacity onPress={onBackToMenu} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Menu</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {currentBookTitle || 'Speed Reader'}
          </Text>
          <Text style={styles.progressText}>
            Word {currentWordIndex + 1} of {words.length}
          </Text>
          <Text style={styles.wpmText}>{wpm} WPM</Text>
        </View>
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
                onPress={() => onWpmChange(speed)}
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
          <TouchableOpacity style={styles.secondaryButton} onPress={onResetReading}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, !isReading && styles.primaryButtonPlay]}
            onPress={onToggleReading}
          >
            <Text style={styles.primaryButtonText}>
              {isReading ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onPickDocument}>
            <Text style={styles.secondaryButtonText}>New File</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#4a69bd',
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  bookTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressText: {
    color: '#b0b0c0',
    fontSize: 14,
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
