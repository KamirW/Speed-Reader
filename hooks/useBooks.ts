import { useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

interface Book {
  id: number;
  title: string;
  author: string;
  downloadCount: number;
  subjects: string[];
  formats: {
    'text/plain': string;
    'text/plain; charset=utf-8': string;
    'text/plain; charset=us-ascii': string;
  };
}

const fetchPopularBooks = async () => {
  try {
    console.log('Fetching popular books...');
    const response = await fetch('https://gutendex.com/books/?sort=popular&mime_type=text/plain');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response received:', data.results?.length || 0, 'books');
    
    // Filter books that have plain text formats
    const booksWithText = data.results.filter((book: any) => 
      book.formats['text/plain'] || 
      book.formats['text/plain; charset=utf-8'] || 
      book.formats['text/plain; charset=us-ascii']
    ).slice(0, 20); // Limit to 20 books for performance
    
    console.log('Books with text format:', booksWithText.length);
    return booksWithText;
  } catch (error) {
    console.error('Error fetching popular books:', error);
    throw error;
  }
};

const searchBooks = async (searchQuery: string) => {
  if (!searchQuery.trim()) {
    return fetchPopularBooks();
  }

  try {
    console.log('Searching books for:', searchQuery);
    const response = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(searchQuery)}&mime_type=text/plain`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Search API response received:', data.results?.length || 0, 'books');
    
    const booksWithText = data.results.filter((book: any) => 
      book.formats['text/plain'] || 
      book.formats['text/plain; charset=utf-8'] || 
      book.formats['text/plain; charset=us-ascii']
    );
    
    console.log('Search results with text format:', booksWithText.length);
    return booksWithText;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const useBooks = (searchQuery: string = '') => {
  const queryKey = searchQuery.trim() ? ['books', 'search', searchQuery] : ['books', 'popular'];
  
  const { data: books = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => searchQuery.trim() ? searchBooks(searchQuery) : fetchPopularBooks(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: (failureCount, error) => {
      console.log(`Query retry attempt ${failureCount}:`, error);
      return failureCount < 3; // Retry up to 3 times
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  if (error) {
    console.error('useBooks hook error:', error);
    Alert.alert('Error', 'Failed to load books. Please check your internet connection and try again.');
  }

  return {
    books: books as Book[],
    isLoading,
    error,
  };
};

export type { Book };
