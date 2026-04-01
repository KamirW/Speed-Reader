import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReadingProgress {
  id: string;
  title: string;
  content: string;
  currentWordIndex: number;
  totalWords: number;
  wpm: number;
  lastReadAt: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface ReadingStats {
  totalWordsRead: number;
  totalReadingTime: number; // in minutes
  averageWPM: number;
  booksCompleted: number;
  currentStreak: number; // days in a row
  longestStreak: number;
  lastReadDate: string | null;
}

export interface UserPreferences {
  defaultWPM: number;
  theme: 'dark' | 'light';
  autoSaveProgress: boolean;
  showReadingStats: boolean;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEYS = {
  READING_PROGRESS: 'jump_read_reading_progress',
  READING_STATS: 'jump_read_reading_stats',
  USER_PREFERENCES: 'jump_read_user_preferences',
} as const;

export class StorageService {
  static async saveReadingProgress(progress: ReadingProgress): Promise<void> {
    try {
      const existingProgress = await this.getReadingProgress();
      const updatedProgress = existingProgress.filter(p => p.id !== progress.id);
      updatedProgress.push(progress);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.READING_PROGRESS,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error('Error saving reading progress:', error);
      throw error;
    }
  }

  static async getReadingProgress(): Promise<ReadingProgress[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting reading progress:', error);
      return [];
    }
  }

  static async getReadingProgressById(id: string): Promise<ReadingProgress | null> {
    try {
      const progress = await this.getReadingProgress();
      return progress.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error getting reading progress by ID:', error);
      return null;
    }
  }

  static async deleteReadingProgress(id: string): Promise<void> {
    try {
      const existingProgress = await this.getReadingProgress();
      const updatedProgress = existingProgress.filter(p => p.id !== id);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.READING_PROGRESS,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error('Error deleting reading progress:', error);
      throw error;
    }
  }

  static async saveReadingStats(stats: ReadingStats): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.READING_STATS,
        JSON.stringify(stats)
      );
    } catch (error) {
      console.error('Error saving reading stats:', error);
      throw error;
    }
  }

  static async getReadingStats(): Promise<ReadingStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.READING_STATS);
      if (data) {
        return JSON.parse(data);
      }
      
      // Return default stats if none exist
      const defaultStats: ReadingStats = {
        totalWordsRead: 0,
        totalReadingTime: 0,
        averageWPM: 0,
        booksCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastReadDate: null,
      };
      
      await this.saveReadingStats(defaultStats);
      return defaultStats;
    } catch (error) {
      console.error('Error getting reading stats:', error);
      return {
        totalWordsRead: 0,
        totalReadingTime: 0,
        averageWPM: 0,
        booksCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastReadDate: null,
      };
    }
  }

  static async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const existingPrefs = await this.getUserPreferences();
      const updatedPrefs = { ...existingPrefs, ...preferences };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(updatedPrefs)
      );
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  static async getUserPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (data) {
        return JSON.parse(data);
      }
      
      // Return default preferences if none exist
      const defaultPrefs: UserPreferences = {
        defaultWPM: 300,
        theme: 'dark',
        autoSaveProgress: true,
        showReadingStats: true,
        hasCompletedOnboarding: false,
      };
      
      // Save directly to avoid recursion
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(defaultPrefs));
      return defaultPrefs;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        defaultWPM: 300,
        theme: 'dark',
        autoSaveProgress: true,
        showReadingStats: true,
        hasCompletedOnboarding: false,
      };
    }
  }

  static async recordReadingSession(wordsRead: number, sessionTime: number, wpm: number): Promise<void> {
    try {
      const stats = await this.getReadingStats();
      
      // Update reading statistics
      stats.totalWordsRead += wordsRead;
      stats.totalReadingTime += sessionTime;
      
      // Calculate new average WPM (weighted average)
      if (stats.totalReadingTime > 0) {
        const overallWPM = stats.totalWordsRead / stats.totalReadingTime;
        stats.averageWPM = Math.round((stats.averageWPM + overallWPM) / 2);
      }
      
      // Update last read date
      stats.lastReadDate = new Date().toISOString();
      
      await this.saveReadingStats(stats);
    } catch (error) {
      console.error('Error recording reading session:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.READING_PROGRESS);
      await AsyncStorage.removeItem(STORAGE_KEYS.READING_STATS);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  static async exportData(): Promise<string> {
    try {
      const progress = await this.getReadingProgress();
      const stats = await this.getReadingStats();
      const preferences = await this.getUserPreferences();
      
      return JSON.stringify({
        progress,
        stats,
        preferences,
        exportedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  static async importData(data: string): Promise<void> {
    try {
      const parsedData = JSON.parse(data);
      
      if (parsedData.progress) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.READING_PROGRESS,
          JSON.stringify(parsedData.progress)
        );
      }
      
      if (parsedData.stats) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.READING_STATS,
          JSON.stringify(parsedData.stats)
        );
      }
      
      if (parsedData.preferences) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_PREFERENCES,
          JSON.stringify(parsedData.preferences)
        );
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}
