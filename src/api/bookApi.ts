import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  QuerySnapshot,
  setDoc,
} from 'firebase/firestore'
import { type Book } from '~/type'
import { db } from './firebase'

const saveBook = async (book: Book): Promise<void> => {
  const authorBookCollection = collection(db, `Author/${book.authorId}/Book`)
  await setDoc(doc(authorBookCollection), {
    ...book,
  })
}

const getBooks = async (): Promise<QuerySnapshot<DocumentData>> => {
  return await getDocs(collectionGroup(db, 'Book'))
}

const getBooksByAuthor = async (authorId: string): Promise<QuerySnapshot<DocumentData>> => {
  return await getDocs(collection(db, `Author/${authorId}/Book`))
}

const deleteBook = async (book: DocumentReference<DocumentData>): Promise<any> => {
  return await deleteDoc(book)
}

export { saveBook, getBooks, getBooksByAuthor, deleteBook }
