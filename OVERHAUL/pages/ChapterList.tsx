import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Play, CheckCircle2, Circle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { books, chapters } from '../data/books';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ChapterList'>;
type Route = RouteProp<RootStackParamList, 'ChapterList'>;

export function ChapterListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { bookId } = route.params;

  const book = books.find(b => b.id === bookId);
  const bookChapters = chapters.filter(c => c.bookId === bookId);

  if (!book) {
    return (
      <View style={styles.centered}>
        <Text>Book not found</Text>
      </View>
    );
  }

  const completed = bookChapters.filter(c => c.isCompleted).length;
  const progress = bookChapters.length > 0 ? (completed / bookChapters.length) * 100 : 0;
  const firstUncompleted = bookChapters.findIndex(c => !c.isCompleted);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#9333ea', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 8 }]}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color="#ffffff" size={24} />
          </TouchableOpacity>

          <View style={styles.bookRow}>
            <Image source={{ uri: book.cover }} style={styles.coverImage} />
            <View style={styles.bookMeta}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>{completed} of {bookChapters.length} chapters</Text>
                <Text style={styles.progressLabel}>{Math.round(progress)}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.chaptersSection}>
          <Text style={styles.chaptersHeading}>Chapters</Text>

          {bookChapters.map((chapter, idx) => (
            <TouchableOpacity
              key={chapter.id}
              style={styles.chapterCard}
              onPress={() => navigation.navigate('Reader', { bookId, chapterId: chapter.id, from: 'Books' })}
              activeOpacity={0.8}
            >
              <View style={styles.chapterIcon}>
                {chapter.isCompleted
                  ? <CheckCircle2 color="#16a34a" size={24} />
                  : <Circle color="#cbd5e1" size={24} />
                }
              </View>
              <View style={styles.chapterInfo}>
                <View style={styles.chapterMetaRow}>
                  <Text style={styles.chapterNum}>Chapter {chapter.number}</Text>
                  {!chapter.isCompleted && idx === firstUncompleted && (
                    <View style={styles.upNextBadge}>
                      <Text style={styles.upNextText}>Up Next</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.chapterTitle}>{chapter.title}</Text>
              </View>
              <View style={styles.playBtn}>
                <Play color="#9333ea" size={18} fill="#9333ea" />
              </View>
            </TouchableOpacity>
          ))}

          {bookChapters.length === 0 && (
            <Text style={styles.emptyText}>No chapters available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 20, paddingBottom: 28 },
  backBtn: { padding: 4, alignSelf: 'flex-start', marginBottom: 16 },
  bookRow: { flexDirection: 'row', gap: 20, alignItems: 'flex-end' },
  coverImage: { width: 110, height: 160, borderRadius: 10 },
  bookMeta: { flex: 1 },
  bookTitle: { color: '#ffffff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  bookAuthor: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#ffffff', borderRadius: 3 },
  chaptersSection: { padding: 20 },
  chaptersHeading: { fontSize: 20, fontWeight: '600', color: '#0f172a', marginBottom: 16 },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  chapterIcon: { width: 28, alignItems: 'center' },
  chapterInfo: { flex: 1 },
  chapterMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  chapterNum: { fontSize: 12, color: '#94a3b8' },
  upNextBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  upNextText: { fontSize: 11, color: '#1d4ed8', fontWeight: '600' },
  chapterTitle: { fontSize: 15, fontWeight: '500', color: '#0f172a' },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { color: '#94a3b8', textAlign: 'center', paddingTop: 48, fontSize: 15 },
});
