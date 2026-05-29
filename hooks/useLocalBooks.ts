import { useState, useEffect, useCallback } from "react";

// Static imports for book files
import book11 from "../assets/books/11.js";
import book12 from "../assets/books/12.js";
import book23 from "../assets/books/23.js";
import book25 from "../assets/books/25.js";
import book27 from "../assets/books/27.js";
import book30 from "../assets/books/30.js";
import book33 from "../assets/books/33.js";
import book34 from "../assets/books/34.js";
import book36 from "../assets/books/36.js";
import book41 from "../assets/books/41.js";
import book43 from "../assets/books/43.js";
import book44 from "../assets/books/44.js";
import book45 from "../assets/books/45.js";
import book46 from "../assets/books/46.js";
import book74 from "../assets/books/74.js";
import book84 from "../assets/books/84.js";
import book98 from "../assets/books/98.js";
import book108 from "../assets/books/108.js";
import book1260 from "../assets/books/1260.js";
import book134 from "../assets/books/134.js";
import book1342 from "../assets/books/1342.js";
import book1400 from "../assets/books/1400.js";
import book1513 from "../assets/books/1513.js";
import book163 from "../assets/books/163.js";
import book1661 from "../assets/books/1661.js";
import book174 from "../assets/books/174.js";
import book1952 from "../assets/books/1952.js";
import book204 from "../assets/books/204.js";
import book215 from "../assets/books/215.js";
import book236 from "../assets/books/236.js";
import book2600 from "../assets/books/2600.js";
import book2701 from "../assets/books/2701.js";
import book2852 from "../assets/books/2852.js";
import book3207 from "../assets/books/3207.js";
import book328 from "../assets/books/328.js";
import book345 from "../assets/books/345.js";
import book371 from "../assets/books/371.js";
import book376 from "../assets/books/376.js";
import book423 from "../assets/books/423.js";
import book434 from "../assets/books/434.js";
import book521 from "../assets/books/521.js";
import book522 from "../assets/books/522.js";
import book523 from "../assets/books/523.js";
import book524 from "../assets/books/524.js";
import book525 from "../assets/books/525.js";
import book526 from "../assets/books/526.js";
import book527 from "../assets/books/527.js";
import book528 from "../assets/books/528.js";
import book529 from "../assets/books/529.js";
import book530 from "../assets/books/530.js";
import book531 from "../assets/books/531.js";
import book532 from "../assets/books/532.js";
import book533 from "../assets/books/533.js";
import book534 from "../assets/books/534.js";
import book535 from "../assets/books/535.js";
import book536 from "../assets/books/536.js";
import book537 from "../assets/books/537.js";
import book538 from "../assets/books/538.js";
import book539 from "../assets/books/539.js";
import book540 from "../assets/books/540.js";
import book541 from "../assets/books/541.js";
import book542 from "../assets/books/542.js";
import book543 from "../assets/books/543.js";
import book544 from "../assets/books/544.js";
import book545 from "../assets/books/545.js";
import book546 from "../assets/books/546.js";
import book547 from "../assets/books/547.js";
import book548 from "../assets/books/548.js";
import book549 from "../assets/books/549.js";
import book550 from "../assets/books/550.js";
import book551 from "../assets/books/551.js";
import book552 from "../assets/books/552.js";
import book553 from "../assets/books/553.js";
import book554 from "../assets/books/554.js";
import book555 from "../assets/books/555.js";
import book556 from "../assets/books/556.js";
import book557 from "../assets/books/557.js";
import book558 from "../assets/books/558.js";
import book559 from "../assets/books/559.js";
import book560 from "../assets/books/560.js";
import book561 from "../assets/books/561.js";
import book562 from "../assets/books/562.js";
import book563 from "../assets/books/563.js";
import book564 from "../assets/books/564.js";
import book565 from "../assets/books/565.js";
import book566 from "../assets/books/566.js";
import book567 from "../assets/books/567.js";
import book568 from "../assets/books/568.js";
import book569 from "../assets/books/569.js";
import book570 from "../assets/books/570.js";
import book571 from "../assets/books/571.js";
import book572 from "../assets/books/572.js";
import book573 from "../assets/books/573.js";
import book574 from "../assets/books/574.js";
import book575 from "../assets/books/575.js";
import book576 from "../assets/books/576.js";
import book577 from "../assets/books/577.js";
import book578 from "../assets/books/578.js";
import book579 from "../assets/books/579.js";
import book580 from "../assets/books/580.js";

const bookMap: Record<string, string> = {
  "11.txt": book11,
  "12.txt": book12,
  "23.txt": book23,
  "25.txt": book25,
  "27.txt": book27,
  "30.txt": book30,
  "33.txt": book33,
  "34.txt": book34,
  "36.txt": book36,
  "41.txt": book41,
  "43.txt": book43,
  "44.txt": book44,
  "45.txt": book45,
  "46.txt": book46,
  "74.txt": book74,
  "84.txt": book84,
  "98.txt": book98,
  "108.txt": book108,
  "1260.txt": book1260,
  "134.txt": book134,
  "1342.txt": book1342,
  "1400.txt": book1400,
  "1513.txt": book1513,
  "163.txt": book163,
  "1661.txt": book1661,
  "174.txt": book174,
  "1952.txt": book1952,
  "204.txt": book204,
  "215.txt": book215,
  "236.txt": book236,
  "2600.txt": book2600,
  "2701.txt": book2701,
  "2852.txt": book2852,
  "3207.txt": book3207,
  "328.txt": book328,
  "345.txt": book345,
  "371.txt": book371,
  "376.txt": book376,
  "423.txt": book423,
  "434.txt": book434,
  "521.txt": book521,
  "522.txt": book522,
  "523.txt": book523,
  "524.txt": book524,
  "525.txt": book525,
  "526.txt": book526,
  "527.txt": book527,
  "528.txt": book528,
  "529.txt": book529,
  "530.txt": book530,
  "531.txt": book531,
  "532.txt": book532,
  "533.txt": book533,
  "534.txt": book534,
  "535.txt": book535,
  "536.txt": book536,
  "537.txt": book537,
  "538.txt": book538,
  "539.txt": book539,
  "540.txt": book540,
  "541.txt": book541,
  "542.txt": book542,
  "543.txt": book543,
  "544.txt": book544,
  "545.txt": book545,
  "546.txt": book546,
  "547.txt": book547,
  "548.txt": book548,
  "549.txt": book549,
  "550.txt": book550,
  "551.txt": book551,
  "552.txt": book552,
  "553.txt": book553,
  "554.txt": book554,
  "555.txt": book555,
  "556.txt": book556,
  "557.txt": book557,
  "558.txt": book558,
  "559.txt": book559,
  "560.txt": book560,
  "561.txt": book561,
  "562.txt": book562,
  "563.txt": book563,
  "564.txt": book564,
  "565.txt": book565,
  "566.txt": book566,
  "567.txt": book567,
  "568.txt": book568,
  "569.txt": book569,
  "570.txt": book570,
  "571.txt": book571,
  "572.txt": book572,
  "573.txt": book573,
  "574.txt": book574,
  "575.txt": book575,
  "576.txt": book576,
  "577.txt": book577,
  "578.txt": book578,
  "579.txt": book579,
  "580.txt": book580,
};

interface Book {
  id: number;
  title: string;
  author: string;
  downloadCount: number;
  subjects: string[];
  filename: string;
}

export const useLocalBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load metadata on mount
  useEffect(() => {
    try {
      // Import metadata from assets
      const metadata = require("../assets/books/metadata.json");
      setBooks(metadata);
    } catch (err) {
      console.error("Error loading local books metadata:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Using useCallback to memoize the function and prevent unnecessary re-creations
  const loadBookContent = useCallback(async (book: Book): Promise<string> => {
    try {
      // Load book content from static imports
      const content = bookMap[book.filename];
      if (!content) {
        throw new Error(`Book file not found: ${book.filename}`);
      }
      return content;
    } catch (err) {
      console.error("Error loading book content:", err);
      throw err;
    }
  }, []);

  return {
    books,
    isLoading,
    error: null,
    loadBookContent,
  };
};

export type { Book };
