import { collection, doc, setDoc } from 'firebase/firestore'
import { type Book } from '@/type'
import { db } from './firebase'

const saveBook = async (book: Book): Promise<void> => {
  const authorBookCollection = collection(db, `Author/${book.authorId}/Book`)
  await setDoc(doc(authorBookCollection), {
    ...book,
  })
}

export { saveBook }
