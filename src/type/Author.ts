export interface Author {
  firstName: string
  lastName: string
}

export interface AuthorRecord {
  id: string
  author: Author
}

export type AuthorMap = Record<string, string>
