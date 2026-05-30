import { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Image, StyleSheet, FlatList, Dimensions,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { books } from '../data/books';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const ALL = 'All';

const { width, height } = Dimensions.get("window");
const minDim = Math.min(width, height);
const isTablet = minDim >= 600;

// Dynamic size calculations - responsive based on device type
const headingFontSize = minDim * (isTablet ? 0.05 : 0.065);
const searchIconSize = minDim * (isTablet ? 0.034 : 0.045);
const searchInputFontSize = minDim * (isTablet ? 0.028 : 0.035);
const searchPaddingV = minDim * (isTablet ? 0.019 : 0.025);
const searchPaddingH = minDim * (isTablet ? 0.023 : 0.03);
const searchGap = minDim * (isTablet ? 0.015 : 0.02);
const chipPaddingV = minDim * (isTablet ? 0.013 : 0.018);
const chipPaddingH = minDim * (isTablet ? 0.03 : 0.04);
const chipGap = minDim * (isTablet ? 0.015 : 0.02);
const chipFontSize = minDim * (isTablet ? 0.025 : 0.032);
const gridPadding = minDim * (isTablet ? 0.03 : 0.04);
const rowGap = minDim * (isTablet ? 0.023 : 0.03);
const resultCountFontSize = minDim * (isTablet ? 0.025 : 0.032);
const bookCardBorderRadius = minDim * (isTablet ? 0.023 : 0.03);
const coverHeight = minDim * (isTablet ? 0.36 : 0.42);
const statusBadgePaddingV = minDim * (isTablet ? 0.006 : 0.008);
const statusBadgePaddingH = minDim * (isTablet ? 0.015 : 0.02);
const statusBadgeFontSize = minDim * (isTablet ? 0.019 : 0.023);
const genreBadgePaddingV = minDim * (isTablet ? 0.006 : 0.008);
const genreBadgePaddingH = minDim * (isTablet ? 0.015 : 0.02);
const genreBadgeFontSize = minDim * (isTablet ? 0.019 : 0.023);
const cardInfoPadding = minDim * (isTablet ? 0.023 : 0.03);
const bookTitleFontSize = minDim * (isTablet ? 0.025 : 0.032);
const bookAuthorFontSize = minDim * (isTablet ? 0.023 : 0.028);
const progressTrackHeight = minDim * (isTablet ? 0.008 : 0.01);
const emptyPaddingT = minDim * (isTablet ? 0.12 : 0.15);
const emptyTextFontSize = minDim * (isTablet ? 0.028 : 0.035);
const clearTextFontSize = minDim * (isTablet ? 0.025 : 0.032);
const headerPaddingH = minDim * (isTablet ? 0.04 : 0.05);

function statusBadge(progress: number): { label: string; color: string } {
  if (progress === 0) return { label: 'Not Started', color: '#94a3b8' };
  if (progress === 100) return { label: 'Completed', color: '#16a34a' };
  return { label: 'In Progress', color: '#2563eb' };
}

export function LibraryScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(ALL);

  const genres = [ALL, ...Array.from(new Set(books.map(b => b.genre)))];

  const filtered = books.filter(b => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchGenre = selectedGenre === ALL || b.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  return (
    <View style={styles.container}>
      {/* Sticky header */}
      <View style={[styles.header, { paddingTop: insets.top + (isTablet ? 16 : 8) }]}>
        <Text style={styles.heading}>Library</Text>

        <View style={styles.searchRow}>
          <Search color="#94a3b8" size={searchIconSize} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books or authors..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {genres.map(genre => {
            const active = selectedGenre === genre;
            return (
              <TouchableOpacity
                key={genre}
                onPress={() => setSelectedGenre(genre)}
                style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
              >
                <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                  {genre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Books grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          filtered.length > 0 ? (
            <Text style={styles.resultCount}>
              {filtered.length} {filtered.length === 1 ? 'book' : 'books'}
              {selectedGenre !== ALL ? ` in ${selectedGenre}` : ''}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No books found</Text>
            {selectedGenre !== ALL && (
              <TouchableOpacity onPress={() => setSelectedGenre(ALL)}>
                <Text style={styles.clearText}>Clear filter</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item: book }) => {
          const badge = statusBadge(book.progress);
          return (
            <TouchableOpacity
              style={styles.bookCard}
              onPress={() => navigation.navigate('ChapterList', { bookId: book.id })}
              activeOpacity={0.85}
            >
              <View>
                <Image source={{ uri: book.cover }} style={styles.cover} />
                <View style={[styles.statusBadge, { backgroundColor: badge.color }]}>
                  <Text style={styles.statusText}>{badge.label}</Text>
                </View>
                <View style={styles.genrePill}>
                  <Text style={styles.genreText}>{book.genre}</Text>
                </View>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
                {book.progress > 0 && book.progress < 100 && (
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${book.progress}%` as any }]} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: headerPaddingH,
    paddingBottom: 0,
  },
  heading: { fontSize: headingFontSize, fontWeight: '700', color: '#0f172a', marginBottom: minDim * 0.023 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: minDim * 0.019,
    paddingHorizontal: searchPaddingH,
    paddingVertical: searchPaddingV,
    gap: searchGap,
    marginBottom: minDim * 0.023,
  },
  searchInput: { flex: 1, fontSize: searchInputFontSize, color: '#0f172a' },
  chips: { paddingBottom: minDim * 0.023, gap: chipGap },
  chip: { paddingHorizontal: chipPaddingH, paddingVertical: chipPaddingV, borderRadius: minDim * 0.095, borderWidth: 1 },
  chipActive: { backgroundColor: '#9333ea', borderColor: 'transparent' },
  chipInactive: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  chipText: { fontSize: chipFontSize },
  chipTextActive: { color: '#ffffff', fontWeight: '600' },
  chipTextInactive: { color: '#475569' },
  grid: { padding: gridPadding, paddingTop: minDim * 0.023, paddingBottom: minDim * 0.15 },
  row: { gap: rowGap, justifyContent: 'space-between', marginBottom: minDim * 0.023 },
  resultCount: { fontSize: resultCountFontSize, color: '#94a3b8', marginBottom: minDim * 0.023 },
  bookCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: bookCardBorderRadius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cover: { width: '100%', height: coverHeight, resizeMode: 'cover' },
  statusBadge: {
    position: 'absolute',
    top: minDim * 0.015,
    right: minDim * 0.015,
    paddingHorizontal: statusBadgePaddingH,
    paddingVertical: statusBadgePaddingV,
    borderRadius: minDim * 0.038,
  },
  statusText: { color: '#ffffff', fontSize: statusBadgeFontSize, fontWeight: '600' },
  genrePill: {
    position: 'absolute',
    bottom: minDim * 0.015,
    left: minDim * 0.015,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: genreBadgePaddingH,
    paddingVertical: genreBadgePaddingV,
    borderRadius: minDim * 0.038,
  },
  genreText: { color: '#ffffff', fontSize: genreBadgeFontSize },
  cardInfo: { padding: cardInfoPadding },
  bookTitle: { fontSize: bookTitleFontSize, fontWeight: '600', color: '#0f172a', marginBottom: minDim * 0.008 },
  bookAuthor: { fontSize: bookAuthorFontSize, color: '#64748b', marginBottom: minDim * 0.012 },
  progressTrack: { height: progressTrackHeight, backgroundColor: '#e2e8f0', borderRadius: progressTrackHeight / 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#9333ea', borderRadius: progressTrackHeight / 2 },
  empty: { alignItems: 'center', paddingTop: emptyPaddingT },
  emptyText: { color: '#94a3b8', fontSize: emptyTextFontSize },
  clearText: { color: '#9333ea', fontSize: clearTextFontSize, marginTop: minDim * 0.015 },
});
