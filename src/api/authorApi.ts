import {
  collection,
  deleteDoc,
  doc,
  type DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  type QuerySnapshot,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { type Author } from '~/type'
import { converter } from './converter'

const getAuthor = async (): Promise<QuerySnapshot<Author>> => {
  return await getDocs(collection(db, 'Author').withConverter(converter<Author>()))
}

const getAuthorById = async (authorId: string): Promise<Author | null> => {
  const docRef = doc(db, 'Author', authorId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as Author
  } else {
    return null
  }
}

const updateAuthor = async (id: string, author: Author): Promise<void> => {
  const authorCollection = collection(db, `Author`)
  await setDoc(doc(authorCollection, id), {
    ...author,
  })
}

const saveAuthor = async (author: Author): Promise<void> => {
  const authorCollection = collection(db, `Author`)
  await setDoc(doc(authorCollection), {
    ...author,
  })
}

const deleteAuthor = async (book: DocumentReference<DocumentData>): Promise<any> => {
  return await deleteDoc(book)
}

export { getAuthor, saveAuthor, getAuthorById, deleteAuthor, updateAuthor }
