import { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Image, StyleSheet, FlatList,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { books } from '../data/books';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const ALL = 'All';

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
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.heading}>Library</Text>

        <View style={styles.searchRow}>
          <Search color="#94a3b8" size={18} />
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
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  heading: { fontSize: 26, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#0f172a' },
  chips: { paddingBottom: 12, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 50, borderWidth: 1 },
  chipActive: { backgroundColor: '#9333ea', borderColor: 'transparent' },
  chipInactive: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  chipText: { fontSize: 13 },
  chipTextActive: { color: '#ffffff', fontWeight: '600' },
  chipTextInactive: { color: '#475569' },
  grid: { padding: 16, paddingTop: 12 },
  row: { gap: 12, justifyContent: 'space-between', marginBottom: 12 },
  resultCount: { fontSize: 13, color: '#94a3b8', marginBottom: 12 },
  bookCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cover: { width: '100%', height: 190, resizeMode: 'cover' },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
  genrePill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  genreText: { color: '#ffffff', fontSize: 10 },
  cardInfo: { padding: 12 },
  bookTitle: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  bookAuthor: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  progressTrack: { height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#9333ea', borderRadius: 2 },
  empty: { alignItems: 'center', paddingTop: 64 },
  emptyText: { color: '#94a3b8', fontSize: 15 },
  clearText: { color: '#9333ea', fontSize: 13, marginTop: 8 },
});
