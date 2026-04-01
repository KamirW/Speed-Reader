import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReadingProgress } from '../hooks/useReadingProgress';

interface StatsScreenProps {
  onBack: () => void;
}

export function StatsScreen({ onBack }: StatsScreenProps) {
  const { stats, getRecentBooks } = useReadingProgress();
  
  const recentBooks = getRecentBooks(5);

  const formatReadingTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const getReadingLevel = (wpm: number) => {
    if (wpm < 150) return { level: 'Beginner', color: '#ef4444' };
    if (wpm < 250) return { level: 'Average', color: '#f59e0b' };
    if (wpm < 400) return { level: 'Good', color: '#10b981' };
    if (wpm < 600) return { level: 'Excellent', color: '#3b82f6' };
    return { level: 'Expert', color: '#8b5cf6' };
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your reading journey!';
    if (streak < 3) return 'Keep it going!';
    if (streak < 7) return "You're on fire!";
    if (streak < 14) return 'Amazing consistency!';
    if (streak < 30) return 'Reading machine!';
    return 'Legendary reader!';
  };

  const readingLevel = stats ? getReadingLevel(stats.averageWPM) : null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0f0f1e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reading Statistics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Main Stats Overview */}
        <View style={styles.mainStatsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats?.currentStreak || 0}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statMessage}>{getStreakMessage(stats?.currentStreak || 0)}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats?.averageWPM || 0}</Text>
            <Text style={styles.statLabel}>Average WPM</Text>
            {readingLevel && (
              <Text style={[styles.readingLevel, { color: readingLevel.color }]}>
                {readingLevel.level}
              </Text>
            )}
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.booksCompleted || 0}</Text>
              <Text style={styles.statItemLabel}>Books Finished</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(stats?.totalWordsRead || 0).toLocaleString()}</Text>
              <Text style={styles.statItemLabel}>Words Read</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatReadingTime(stats?.totalReadingTime || 0)}</Text>
              <Text style={styles.statItemLabel}>Total Reading Time</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.longestStreak || 0}</Text>
              <Text style={styles.statItemLabel}>Longest Streak</Text>
            </View>
          </View>
        </View>

        {/* Reading Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Progress</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Daily Goal</Text>
              <Text style={styles.progressValue}>15 minutes</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>75% complete today</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {recentBooks.length === 0 ? (
            <Text style={styles.emptyText}>No recent reading activity</Text>
          ) : (
            recentBooks.map((book) => (
              <View key={book.id} style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text style={styles.activityMeta}>
                    {Math.round((book.currentWordIndex / book.totalWords) * 100)}% complete • {book.wpm} WPM
                  </Text>
                </View>
                <View style={styles.activityStatus}>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: book.isCompleted ? '#4ade80' : '#f59e0b' }
                  ]} />
                </View>
              </View>
            ))
          )}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          <View style={styles.achievementsGrid}>
            <View style={[
              styles.achievement,
              (stats?.currentStreak || 0) >= 3 && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <Text style={styles.achievementTitle}>3 Day Streak</Text>
              <Text style={styles.achievementDesc}>
                Read for 3 days in a row
              </Text>
            </View>
            
            <View style={[
              styles.achievement,
              (stats?.booksCompleted || 0) >= 1 && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>📚</Text>
              <Text style={styles.achievementTitle}>First Book</Text>
              <Text style={styles.achievementDesc}>
                Complete your first book
              </Text>
            </View>
            
            <View style={[
              styles.achievement,
              (stats?.averageWPM || 0) >= 300 && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>⚡</Text>
              <Text style={styles.achievementTitle}>Speed Reader</Text>
              <Text style={styles.achievementDesc}>
                Reach 300 WPM average
              </Text>
            </View>
            
            <View style={[
              styles.achievement,
              (stats?.totalWordsRead || 0) >= 10000 && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>🌟</Text>
              <Text style={styles.achievementTitle}>Word Master</Text>
              <Text style={styles.achievementDesc}>
                Read 10,000 words
              </Text>
            </View>
          </View>
        </View>

        {/* Reading Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Tips</Text>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Pro Tip</Text>
            <Text style={styles.tipText}>
              Try increasing your WPM gradually. Start with what's comfortable, then increase by 25-50 WPM each week.
            </Text>
          </View>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🎯 Focus Tip</Text>
            <Text style={styles.tipText}>
              Take breaks every 20-30 minutes to maintain focus and comprehension.
            </Text>
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
  mainStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4ade80',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },
  statMessage: {
    fontSize: 12,
    color: '#808090',
    textAlign: 'center',
  },
  readingLevel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statItemLabel: {
    fontSize: 12,
    color: '#808090',
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#ffffff',
  },
  progressValue: {
    fontSize: 14,
    color: '#4ade80',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#808090',
  },
  emptyText: {
    color: '#808090',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  activityItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  activityMeta: {
    fontSize: 12,
    color: '#808090',
  },
  activityStatus: {
    marginLeft: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievement: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 10,
    color: '#808090',
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ade80',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
});
