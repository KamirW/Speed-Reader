import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
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

const { width, height } = Dimensions.get("window");
const minDim = Math.min(width, height);
const isTablet = minDim >= 600;

// Dynamic size calculations - responsive based on device type
const backIconSize = minDim * (isTablet ? 0.046 : 0.055);
const headerPaddingB = minDim * (isTablet ? 0.053 : 0.065);
const headerPaddingH = minDim * (isTablet ? 0.038 : 0.045);
const backBtnPadding = minDim * (isTablet ? 0.008 : 0.01);
const backBtnMarginB = minDim * (isTablet ? 0.03 : 0.035);
const bookRowGap = minDim * (isTablet ? 0.038 : 0.045);
const coverImageW = minDim * (isTablet ? 0.21 : 0.25);
const coverImageH = minDim * (isTablet ? 0.31 : 0.36);
const bookTitleFontSize = minDim * (isTablet ? 0.042 : 0.05);
const bookAuthorFontSize = minDim * (isTablet ? 0.026 : 0.032);
const progressLabelFontSize = minDim * (isTablet ? 0.023 : 0.028);
const progressLabelMarginB = minDim * (isTablet ? 0.012 : 0.015);
const progressTrackHeight = minDim * (isTablet ? 0.012 : 0.015);
const chaptersSectionPadding = minDim * (isTablet ? 0.038 : 0.045);
const chaptersHeadingFontSize = minDim * (isTablet ? 0.038 : 0.045);
const chaptersHeadingMarginB = minDim * (isTablet ? 0.03 : 0.035);
const chapterCardGap = minDim * (isTablet ? 0.027 : 0.032);
const chapterCardPadding = minDim * (isTablet ? 0.03 : 0.035);
const chapterCardMarginB = minDim * (isTablet ? 0.019 : 0.023);
const chapterIconW = minDim * (isTablet ? 0.053 : 0.06);
const chapterMetaRowGap = minDim * (isTablet ? 0.015 : 0.02);
const chapterNumFontSize = minDim * (isTablet ? 0.023 : 0.028);
const upNextBadgePaddingV = minDim * (isTablet ? 0.004 : 0.005);
const upNextBadgePaddingH = minDim * (isTablet ? 0.015 : 0.02);
const upNextBadgeBorderRadius = minDim * (isTablet ? 0.038 : 0.045);
const upNextTextFontSize = minDim * (isTablet ? 0.021 : 0.025);
const chapterTitleFontSize = minDim * (isTablet ? 0.028 : 0.032);
const playBtnSize = minDim * (isTablet ? 0.069 : 0.08);
const playBtnBorderRadius = playBtnSize / 2;
const emptyPaddingT = minDim * (isTablet ? 0.09 : 0.11);
const emptyTextFontSize = minDim * (isTablet ? 0.028 : 0.035);

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: minDim * 0.15 }}>
        <LinearGradient
          colors={['#9333ea', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + (isTablet ? 8 : 4) }]}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color="#ffffff" size={backIconSize} />
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
                  ? <CheckCircle2 color="#16a34a" size={backIconSize} />
                  : <Circle color="#cbd5e1" size={backIconSize} />
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
                <Play color="#9333ea" size={minDim * 0.034} fill="#9333ea" />
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
  header: { paddingHorizontal: headerPaddingH, paddingBottom: headerPaddingB },
  backBtn: { padding: backBtnPadding, alignSelf: 'flex-start', marginBottom: backBtnMarginB },
  bookRow: { flexDirection: 'row', gap: bookRowGap, alignItems: 'flex-end' },
  coverImage: { width: coverImageW, height: coverImageH, borderRadius: minDim * 0.019 },
  bookMeta: { flex: 1 },
  bookTitle: { color: '#ffffff', fontSize: bookTitleFontSize, fontWeight: '700', marginBottom: minDim * 0.008 },
  bookAuthor: { color: 'rgba(255,255,255,0.8)', fontSize: bookAuthorFontSize, marginBottom: minDim * 0.03 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: progressLabelMarginB },
  progressLabel: { color: 'rgba(255,255,255,0.8)', fontSize: progressLabelFontSize },
  progressTrack: {
    height: progressTrackHeight,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: progressTrackHeight / 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#ffffff', borderRadius: progressTrackHeight / 2 },
  chaptersSection: { padding: chaptersSectionPadding },
  chaptersHeading: { fontSize: chaptersHeadingFontSize, fontWeight: '600', color: '#0f172a', marginBottom: chaptersHeadingMarginB },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: chapterCardGap,
    backgroundColor: '#ffffff',
    borderRadius: minDim * 0.023,
    padding: chapterCardPadding,
    marginBottom: chapterCardMarginB,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  chapterIcon: { width: chapterIconW, alignItems: 'center' },
  chapterInfo: { flex: 1 },
  chapterMetaRow: { flexDirection: 'row', alignItems: 'center', gap: chapterMetaRowGap, marginBottom: minDim * 0.008 },
  chapterNum: { fontSize: chapterNumFontSize, color: '#94a3b8' },
  upNextBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: upNextBadgePaddingH,
    paddingVertical: upNextBadgePaddingV,
    borderRadius: upNextBadgeBorderRadius,
  },
  upNextText: { fontSize: upNextTextFontSize, color: '#1d4ed8', fontWeight: '600' },
  chapterTitle: { fontSize: chapterTitleFontSize, fontWeight: '500', color: '#0f172a' },
  playBtn: {
    width: playBtnSize,
    height: playBtnSize,
    borderRadius: playBtnBorderRadius,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { color: '#94a3b8', textAlign: 'center', paddingTop: emptyPaddingT, fontSize: emptyTextFontSize },
});
