export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  ChapterList: { bookId: string };
  Reader: { bookId?: string; chapterId?: string; from: 'Books' | 'Upload' };
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  FileUpload: undefined;
};