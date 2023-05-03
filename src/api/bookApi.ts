import { collection, collectionGroup, doc, DocumentData, getDocs, QuerySnapshot, setDoc } from 'firebase/firestore'
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

export { saveBook, getBooks, getBooksByAuthor }
