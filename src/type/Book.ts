export enum BookType {
  Ebook,
  Audio,
  Paper,
}

export interface Book {
  title: string
  rating: -1 | 0 | 1 | 2 | 3 | 4 | 5
  genre?: string
  series?: string
  number?: number
  review?: string
  spoilerReview?: string
  dateRead?: string
  bookType?: BookType
  authorId: string
}

export interface BookRecord {
  id: string
  book: Book
}
