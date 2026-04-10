import { useInfiniteQuery } from '@tanstack/react-query';
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

const fetchPopularBooks = async ({ pageParam = 1 }) => {
  const response = await fetch(`https://gutendex.com/books?sort=popular&mime_type=text/plain&page=${pageParam}`);
  const data = await response.json();
  
  // Filter books that have plain text formats
  const booksWithText = data.results.filter((book: any) => 
    book.formats['text/plain'] || 
    book.formats['text/plain; charset=utf-8'] || 
    book.formats['text/plain; charset=us-ascii']
  );
  
  return {
    books: booksWithText,
    nextPage: data.next ? pageParam + 1 : null,
    hasMore: !!data.next,
  };
};

const searchBooks = async ({ searchQuery, pageParam = 1 }: { searchQuery: string; pageParam?: number }) => {
  if (!searchQuery.trim()) {
    return fetchPopularBooks({ pageParam });
  }

  const response = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(searchQuery)}&mime_type=text/plain&page=${pageParam}`);
  const data = await response.json();
  
  const booksWithText = data.results.filter((book: any) => 
    book.formats['text/plain'] || 
    book.formats['text/plain; charset=utf-8'] || 
    book.formats['text/plain; charset=us-ascii']
  );
  
  return {
    books: booksWithText,
    nextPage: data.next ? pageParam + 1 : null,
    hasMore: !!data.next,
  };
};

export const useBooks = (searchQuery: string = '') => {
  const queryKey = searchQuery.trim() ? ['books', 'search', searchQuery] : ['books', 'popular'];
  
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => 
      searchQuery.trim() 
        ? searchBooks({ searchQuery, pageParam })
        : fetchPopularBooks({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Flatten the pages to get all books
  const books = data?.pages.flatMap(page => page.books) || [];

  if (error) {
    Alert.alert('Error', 'Failed to load books. Please try again.');
  }

  return {
    books: books as Book[],
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export type { Book };
