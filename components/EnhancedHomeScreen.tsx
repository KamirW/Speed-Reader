import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { ReadingProgress } from '../services/StorageService';
import { SettingsScreen } from './SettingsScreen';
import { StatsScreen } from './StatsScreen';

interface EnhancedHomeScreenProps {
  onPickDocument: () => void;
  onShowLibrary: () => void;
  onResumeReading: (progress: ReadingProgress) => void;
}

export function EnhancedHomeScreen({ 
  onPickDocument, 
  onShowLibrary, 
  onResumeReading 
}: EnhancedHomeScreenProps) {
  const { stats, loading, getRecentBooks, getCompletedBooks, refreshData } = useReadingProgress();
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Refresh data when screen becomes active
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };
  
  const recentBooks = getRecentBooks(3);
  const completedBooks = getCompletedBooks(3);

  const formatReadingTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const getProgressPercentage = (book: ReadingProgress) => {
    return Math.round((book.currentWordIndex / book.totalWords) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  if (showStats) {
    return <StatsScreen onBack={() => setShowStats(false)} />;
  }

  if (loading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#0f0f1e', '#16213e']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your library...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#0f0f1e', '#16213e']} style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ade80" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Jump Read</Text>
            <Text style={styles.subtitle}>Welcome back! Ready to read?</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(true)}>
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        {stats && (
          <TouchableOpacity 
            style={styles.statsContainer} 
            onPress={() => setShowStats(true)}
            activeOpacity={0.8}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.booksCompleted}</Text>
              <Text style={styles.statLabel}>Books Finished</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.round(stats.averageWPM)}</Text>
              <Text style={styles.statLabel}>Avg WPM</Text>
            </View>
            <Text style={styles.tapToView}>Tap to view detailed stats →</Text>
          </TouchableOpacity>
        )}

        {/* Continue Reading Section */}
        {recentBooks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Reading</Text>
            {recentBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                onPress={() => onResumeReading(book)}
              >
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { width: `${getProgressPercentage(book)}%` }
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {getProgressPercentage(book)}%
                    </Text>
                  </View>
                  <Text style={styles.bookMeta}>
                    Last read {formatDate(book.lastReadAt)} • {book.wpm} WPM
                  </Text>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  <Text style={styles.playButtonText}>▶</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={onPickDocument}>
              <Text style={styles.actionIcon}>📄</Text>
              <Text style={styles.actionTitle}>Upload File</Text>
              <Text style={styles.actionSubtitle}>Import text files</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={onShowLibrary}>
              <Text style={styles.actionIcon}>📚</Text>
              <Text style={styles.actionTitle}>Free Library</Text>
              <Text style={styles.actionSubtitle}>Browse classics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recently Completed */}
        {completedBooks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Completed</Text>
            {completedBooks.map((book) => (
              <View key={book.id} style={styles.completedBookCard}>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text style={styles.bookMeta}>
                    Finished {formatDate(book.lastReadAt)} • {book.wpm} WPM
                  </Text>
                </View>
                <Text style={styles.completedIcon}>✓</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reading Stats Summary */}
        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Reading Journey</Text>
            <View style={styles.statsSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Words Read</Text>
                <Text style={styles.summaryValue}>
                  {stats.totalWordsRead.toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Reading Time</Text>
                <Text style={styles.summaryValue}>
                  {formatReadingTime(stats.totalReadingTime)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Longest Streak</Text>
                <Text style={styles.summaryValue}>
                  {stats.longestStreak} days
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b0c0',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  tapToView: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    fontSize: 12,
    color: '#808090',
    fontStyle: 'italic',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ade80',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#b0b0c0',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  bookCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBookCard: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#4ade80',
    fontWeight: '600',
    minWidth: 35,
  },
  bookMeta: {
    fontSize: 12,
    color: '#808090',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a69bd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedIcon: {
    fontSize: 20,
    color: '#4ade80',
    fontWeight: 'bold',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#808090',
    textAlign: 'center',
  },
  statsSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#b0b0c0',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
