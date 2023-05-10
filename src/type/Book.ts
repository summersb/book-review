export enum BookType {
  Ebook,
  Audio,
  Paper,
}

export type Rating = -1 | 0 | 1 | 2 | 3 | 4 | 5

export interface Book {
  authorId: string
  title: string
  rating: Rating
  genre?: string
  series?: string
  number?: number
  review?: string
  spoilerReview?: string
  dateRead?: string
  bookType?: BookType
}
