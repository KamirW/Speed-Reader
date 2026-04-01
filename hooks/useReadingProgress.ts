import { useState, useEffect, useCallback } from 'react';
import { StorageService, ReadingProgress, ReadingStats, UserPreferences } from '../services/StorageService';

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [progressData, statsData, preferencesData] = await Promise.all([
          StorageService.getReadingProgress(),
          StorageService.getReadingStats(),
          StorageService.getUserPreferences(),
        ]);

        setProgress(progressData);
        setStats(statsData);
        setPreferences(preferencesData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set default values on error to prevent infinite loading
        setProgress([]);
        setStats({
          totalWordsRead: 0,
          totalReadingTime: 0,
          averageWPM: 0,
          booksCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastReadDate: null,
        });
        setPreferences({
          defaultWPM: 300,
          theme: 'dark',
          autoSaveProgress: true,
          showReadingStats: true,
          hasCompletedOnboarding: false,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const saveProgress = useCallback(async (newProgress: ReadingProgress) => {
    try {
      await StorageService.saveReadingProgress(newProgress);
      setProgress(prev => {
        const filtered = prev.filter(p => p.id !== newProgress.id);
        return [...filtered, newProgress];
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }, []);

  const deleteProgress = useCallback(async (id: string) => {
    try {
      await StorageService.deleteReadingProgress(id);
      setProgress(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting progress:', error);
      throw error;
    }
  }, []);

  const updateStats = useCallback(async (newStats: Partial<ReadingStats>) => {
    try {
      const currentStats = stats || await StorageService.getReadingStats();
      const updatedStats = { ...currentStats, ...newStats };
      await StorageService.saveReadingStats(updatedStats);
      setStats(updatedStats);
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  }, [stats]);

  const updatePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    try {
      const currentPrefs = preferences || await StorageService.getUserPreferences();
      const updatedPrefs = { ...currentPrefs, ...newPreferences };
      await StorageService.updateUserPreferences(updatedPrefs);
      setPreferences(updatedPrefs);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }, [preferences]);

  const getRecentBooks = useCallback((limit: number = 3) => {
    return progress
      .filter(p => !p.isCompleted)
      .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
      .slice(0, limit);
  }, [progress]);

  const getCompletedBooks = useCallback((limit: number = 5) => {
    return progress
      .filter(p => p.isCompleted)
      .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
      .slice(0, limit);
  }, [progress]);

  const markAsCompleted = useCallback(async (id: string) => {
    const bookProgress = progress.find(p => p.id === id);
    if (!bookProgress) return;

    const updatedProgress: ReadingProgress = {
      ...bookProgress,
      isCompleted: true,
      currentWordIndex: bookProgress.totalWords - 1,
      lastReadAt: new Date().toISOString(),
    };

    await saveProgress(updatedProgress);
    
    // Update stats
    const completedCount = (stats?.booksCompleted || 0) + 1;
    await updateStats({ booksCompleted: completedCount });
  }, [progress, stats, saveProgress, updateStats]);

  const recordReadingSession = useCallback(async (
    wordsRead: number,
    readingTimeMinutes: number,
    averageWPM: number
  ) => {
    const currentStats = stats || await StorageService.getReadingStats();
    
    const newTotalWords = currentStats.totalWordsRead + wordsRead;
    const newTotalTime = currentStats.totalReadingTime + readingTimeMinutes;
    const newAverageWPM = newTotalTime > 0 ? 
      Math.round((newTotalWords / newTotalTime)) : currentStats.averageWPM;

    // Update streak
    const today = new Date().toDateString();
    const lastReadDate = currentStats.lastReadDate;
    let newStreak = currentStats.currentStreak;
    let newLongestStreak = currentStats.longestStreak;

    if (lastReadDate) {
      const lastRead = new Date(lastReadDate);
      const daysDiff = Math.floor((Date.now() - lastRead.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        newStreak += 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    newLongestStreak = Math.max(newLongestStreak, newStreak);

    await updateStats({
      totalWordsRead: newTotalWords,
      totalReadingTime: newTotalTime,
      averageWPM: newAverageWPM,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastReadDate: today,
    });
  }, [stats, updateStats]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [progressData, statsData, preferencesData] = await Promise.all([
        StorageService.getReadingProgress(),
        StorageService.getReadingStats(),
        StorageService.getUserPreferences(),
      ]);

      setProgress(progressData);
      setStats(statsData);
      setPreferences(preferencesData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    progress,
    stats,
    preferences,
    loading,
    saveProgress,
    deleteProgress,
    updateStats,
    updatePreferences,
    getRecentBooks,
    getCompletedBooks,
    markAsCompleted,
    recordReadingSession,
    refreshData,
  };
}
