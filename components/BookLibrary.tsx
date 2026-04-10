import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ListRenderItem,
} from 'react-native';
import { useBooks, Book } from '../hooks/useBooks';

interface BookLibraryProps {
  onBookSelect: (content: string, title: string) => void;
  onBack: () => void;
}

export const BookLibrary: React.FC<BookLibraryProps> = ({ onBookSelect, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [downloadingBookId, setDownloadingBookId] = useState<number | null>(null);

  const { books, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useBooks(''); // Fetch all books once and cache them

  const handleClear = () => {
    setActualSearchQuery('');
    setSearchQuery('');
  };

  const handleSearch = () => {
    // Don't trigger new API call, just update search query for local filtering
    setActualSearchQuery(searchQuery);
  };

  const categories = [
    { id: 'all', name: 'All Books' },
    { id: 'fiction', name: 'Fiction' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'philosophy', name: 'Philosophy' },
    { id: 'children', name: 'Children' },
  ];

  const downloadBook = useCallback(async (book: Book) => {
    try {
      setDownloadingBookId(book.id);
      
      // Find the best text format
      let textUrl = book.formats['text/plain'] ||
        book.formats['text/plain; charset=utf-8'] ||
        book.formats['text/plain; charset=us-ascii'];

      if (!textUrl) {
        Alert.alert('Error', 'Text format not available for this book.');
        return;
      }

      const textContent = await fetch(textUrl).then(res => res.text());

      onBookSelect(textContent, `${book.title} by ${book.author}`);

    } catch (error) {
      console.error('Error downloading book:', error);
      Alert.alert('Error', 'Failed to download book. Please try again.');
    } finally {
      setDownloadingBookId(null);
    }
  }, [onBookSelect]);

  const filteredBooks = useMemo(() => {
    return books.filter((book: Book) => {
      const matchesSearch = book?.title?.toLowerCase().includes(actualSearchQuery.toLowerCase()) ||
                           book?.author?.toLowerCase().includes(actualSearchQuery.toLowerCase());

      if (selectedCategory === 'all') return matchesSearch;

      const categoryKeywords: { [key: string]: string[] } = {
        fiction: ['fiction', 'novel', 'story', 'tale'],
        science: ['science', 'scientific', 'physics', 'chemistry', 'biology'],
        history: ['history', 'historical', 'ancient', 'war'],
        philosophy: ['philosophy', 'philosophical', 'ethics', 'logic'],
        children: ['children', 'child', 'juvenile', 'fairy', 'tale'],
      };

      const keywords = categoryKeywords[selectedCategory] || [];
      const matchesCategory = keywords.some(keyword =>
        book?.subjects?.some((subject: string) => subject.toLowerCase().includes(keyword))
      );

      return matchesSearch && matchesCategory;
    });
  }, [books, actualSearchQuery, selectedCategory]);

  const renderBookItem: ListRenderItem<Book> = useCallback(({ item: book }) => (
    <View style={styles.bookItem}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>by {book.author}</Text>
        <Text style={styles.bookMeta}>
          📖 {book.downloadCount?.toLocaleString() || '0'} reads
        </Text>
        {book.subjects.length > 0 && (
          <Text style={styles.bookSubjects} numberOfLines={1}>
            {book.subjects.slice(0, 3).join(', ')}
          </Text>
        )}
      </View>
      <TouchableOpacity 
        style={[styles.downloadButton, downloadingBookId === book.id && styles.downloadButtonDisabled]} 
        onPress={() => downloadBook(book)}
        disabled={downloadingBookId === book.id}
      >
        {downloadingBookId === book.id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.downloadButtonText}>Read</Text>
        )}
      </TouchableOpacity>
    </View>
  ), [downloadBook, downloadingBookId]);

  const keyExtractor = useCallback((item: Book) => item.id.toString(), []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={styles.footerLoadingText}>Loading more books...</Text>
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <LinearGradient colors={['#1a1a2e', '#0f0f1e', '#16213e']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📚 Free Library</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search books or authors..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => { }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButtonInside} onPress={handleClear}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer} contentContainerStyle={styles.categoryContent}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category.id && styles.categoryButtonTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Books List */}
      { isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      ) : (
        <FlatList
          style={styles.booksContainer}
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.booksListContent}
          ListEmptyComponent={
            <View style={styles.noBooksContainer}>
              <Text style={styles.noBooksText}>No books found</Text>
            </View>
          }
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: 100, // Approximate item height
            offset: 100 * index,
            index,
          })}
        />
      )}
    </LinearGradient>
  );
};

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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 8,
    paddingLeft: 12,
    paddingRight: 45, // Make room for clear button
    color: '#fff',
    fontSize: 16,
  },
  clearButtonInside: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'center',
    marginLeft: 15, // Better spacing from input
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginLeft: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    height: 25,
    maxHeight: 25,
    marginTop: -5,
    marginBottom: 20,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 10,
    alignSelf: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  booksContainer: {
    flex: 1,
  },
  booksListContent: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  bookItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  bookMeta: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  bookSubjects: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    backgroundColor: '#666',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noBooksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBooksText: {
    color: '#fff',
    fontSize: 18,
  },
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerLoadingText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
});
