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
  const response = await fetch('https://gutendex.com/books?sort=popular&mime_type=text/plain');
  const data = await response.json();
  
  // Filter books that have plain text formats
  const booksWithText = data.results.filter((book: any) => 
    book.formats['text/plain'] || 
    book.formats['text/plain; charset=utf-8'] || 
    book.formats['text/plain; charset=us-ascii']
  ).slice(0, 20); // Limit to 20 books for performance
  
  return booksWithText;
};

const searchBooks = async (searchQuery: string) => {
  if (!searchQuery.trim()) {
    return fetchPopularBooks();
  }

  const response = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(searchQuery)}&mime_type=text/plain`);
  const data = await response.json();
  
  const booksWithText = data.results.filter((book: any) => 
    book.formats['text/plain'] || 
    book.formats['text/plain; charset=utf-8'] || 
    book.formats['text/plain; charset=us-ascii']
  );
  
  return booksWithText;
};

export const useBooks = (searchQuery: string = '') => {
  const queryKey = searchQuery.trim() ? ['books', 'search', searchQuery] : ['books', 'popular'];
  
  const { data: books = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => searchQuery.trim() ? searchBooks(searchQuery) : fetchPopularBooks(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  if (error) {
    Alert.alert('Error', 'Failed to load books. Please try again.');
  }

  return {
    books: books as Book[],
    isLoading,
    error,
  };
};

export type { Book };
