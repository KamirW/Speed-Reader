import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { StorageService } from '../services/StorageService';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { preferences, updatePreferences, getRecentBooks, deleteProgress } = useReadingProgress();
  const [selectedWPM, setSelectedWPM] = useState(preferences?.defaultWPM || 300);
  
  const recentBooks = getRecentBooks(10);

  const wpmOptions = [100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800];

  const handleWPMChange = async (wpm: number) => {
    setSelectedWPM(wpm);
    try {
      await updatePreferences({ defaultWPM: wpm });
    } catch (error) {
      Alert.alert('Error', 'Failed to update default WPM');
    }
  };

  const handleDeleteProgress = async (bookId: string, bookTitle: string) => {
    Alert.alert(
      'Delete Progress',
      `Are you sure you want to delete your progress for "${bookTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProgress(bookId);
              Alert.alert('Success', 'Progress deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete progress');
            }
          },
        },
      ]
    );
  };

  const handleResetOnboarding = async () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the onboarding screens again. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await updatePreferences({ hasCompletedOnboarding: false });
              Alert.alert('Success', 'Onboarding reset. Restart the app to see it again.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset onboarding');
            }
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const data = await StorageService.exportData();
      // In a real app, you would use Share API or save to file
      Alert.alert(
        'Export Data',
        'Data exported successfully! In a production app, this would be saved to a file or shared.',
        [{ text: 'OK' }]
      );
      console.log('Exported data:', data);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your reading progress, stats, and preferences. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              Alert.alert('Success', 'All data cleared. Restart the app to start fresh.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#0f0f1e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Reading Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Preferences</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Default Reading Speed</Text>
            <Text style={styles.settingValue}>{selectedWPM} WPM</Text>
          </View>
          
          <View style={styles.wpmGrid}>
            {wpmOptions.map((wpm) => (
              <TouchableOpacity
                key={wpm}
                style={[
                  styles.wpmButton,
                  selectedWPM === wpm && styles.wpmButtonActive
                ]}
                onPress={() => handleWPMChange(wpm)}
              >
                <Text style={[
                  styles.wpmButtonText,
                  selectedWPM === wpm && styles.wpmButtonTextActive
                ]}>
                  {wpm}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reading Progress Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Progress</Text>
          
          {recentBooks.length === 0 ? (
            <Text style={styles.emptyText}>No reading progress yet</Text>
          ) : (
            recentBooks.map((book) => (
              <View key={book.id} style={styles.progressItem}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text style={styles.progressMeta}>
                    {Math.round((book.currentWordIndex / book.totalWords) * 100)}% complete • {book.wpm} WPM
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProgress(book.id, book.title)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.settingButton} onPress={handleResetOnboarding}>
            <Text style={styles.settingButtonText}>Reset Onboarding</Text>
            <Text style={styles.settingDescription}>Show the welcome screens again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton} onPress={handleExportData}>
            <Text style={styles.settingButtonText}>Export Data</Text>
            <Text style={styles.settingDescription}>Download your reading progress and stats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingButton, styles.dangerButton]} onPress={handleClearAllData}>
            <Text style={[styles.settingButtonText, styles.dangerButtonText]}>Clear All Data</Text>
            <Text style={styles.settingDescription}>Permanently delete everything</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Developer</Text>
            <Text style={styles.aboutValue}>Jump Read Team</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
  settingValue: {
    fontSize: 16,
    color: '#4ade80',
    fontWeight: '600',
  },
  wpmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  wpmButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  emptyText: {
    color: '#808090',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  progressItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  progressMeta: {
    fontSize: 12,
    color: '#808090',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  settingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#808090',
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  dangerButtonText: {
    color: '#ef4444',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
  aboutValue: {
    fontSize: 16,
    color: '#808090',
  },
});
