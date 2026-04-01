import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WelcomeScreenProps {
  onPickDocument: () => void;
  onShowLibrary: () => void;
}

export function WelcomeScreen({ onPickDocument, onShowLibrary }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#0f0f1e', '#16213e']}
        style={styles.gradient}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Jump Read</Text>
          <Text style={styles.subtitle}>Transform your reading speed with focus</Text>

          <TouchableOpacity style={styles.uploadButton} onPress={onPickDocument}>
            <Text style={styles.uploadButtonText}>📄 Upload Text File</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.libraryButton} onPress={onShowLibrary}>
            <Text style={styles.libraryButtonText}>📚 Free Library</Text>
          </TouchableOpacity>

          <Text style={styles.instructions}>
            Choose a file or browse our free library to begin
          </Text>
        </View>
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
    marginBottom: 20,
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
  libraryButton: {
    backgroundColor: '#27ae60',
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
  libraryButtonText: {
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
});
