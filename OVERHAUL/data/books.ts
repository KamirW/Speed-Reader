export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  totalChapters: number;
  genre: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  number: number;
  title: string;
  content: string;
  isCompleted: boolean;
}

export const books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    progress: 45,
    totalChapters: 9,
    genre: "Classic Fiction",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    progress: 0,
    totalChapters: 31,
    genre: "Drama",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop",
    progress: 78,
    totalChapters: 23,
    genre: "Dystopian",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    progress: 30,
    totalChapters: 61,
    genre: "Romance",
  },
  {
    id: "5",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&h=600&fit=crop",
    progress: 0,
    totalChapters: 26,
    genre: "Coming of Age",
  },
  {
    id: "6",
    title: "Animal Farm",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    progress: 100,
    totalChapters: 10,
    genre: "Satire",
  },
];

export const chapters: Chapter[] = [
  {
    id: "1-1",
    bookId: "1",
    number: 1,
    title: "Chapter I",
    content: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. Whenever you feel like criticizing anyone, he told me, just remember that all the people in this world haven't had the advantages that you've had. He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.",
    isCompleted: true,
  },
  {
    id: "1-2",
    bookId: "1",
    number: 2,
    title: "Chapter II",
    content: "About halfway between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens; where ashes take the forms of houses and chimneys and rising smoke and, finally, with a transcendent effort, of men who move dimly and already crumbling through the powdery air.",
    isCompleted: true,
  },
  {
    id: "1-3",
    bookId: "1",
    number: 3,
    title: "Chapter III",
    content: "There was music from my neighbor's house through the summer nights. In his blue gardens men and girls came and went like moths among the whisperings and the champagne and the stars. At high tide in the afternoon I watched his guests diving from the tower of his raft, or taking the sun on the hot sand of his beach while his two motor-boats slit the waters of the Sound, drawing aquaplanes over cataracts of foam.",
    isCompleted: false,
  },
  {
    id: "1-4",
    bookId: "1",
    number: 4,
    title: "Chapter IV",
    content: "On Sunday morning while church bells rang in the villages alongshore, the world and its mistress returned to Gatsby's house and twinkled hilariously on his lawn. He's a bootlegger, said the young ladies, moving somewhere between his cocktails and his flowers. One time he killed a man who had found out that he was nephew to Von Hindenburg and second cousin to the devil.",
    isCompleted: false,
  },
  {
    id: "1-5",
    bookId: "1",
    number: 5,
    title: "Chapter V",
    content: "When I came home to West Egg that night I was afraid for a moment that my house was on fire. Two o'clock and the whole corner of the peninsula was blazing with light, which fell unreal on the shrubbery and made thin elongating glints upon the roadside wires. Turning a corner, I saw that it was Gatsby's house, lit from tower to cellar.",
    isCompleted: false,
  },
];
