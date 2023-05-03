import {
  collection,
  type DocumentData,
  getDocs,
  type QuerySnapshot,
  setDoc,
  doc,
  getDoc,
  DocumentReference,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { type Author, Book } from '../type'

// const converter = {
//   toFirestore: (data: Author) => data,
//   fromFirestore: (snap: QuerySnapshot) => snap.data() as Author,
// }

const getAuthor = async (): Promise<QuerySnapshot<DocumentData>> => {
  return await getDocs(collection(db, 'Author')) // .withConverter(converter)
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

const saveAuthor = async (author: Author): Promise<void> => {
  const authorCollection = collection(db, `Author`)
  await setDoc(doc(authorCollection), {
    ...author,
  })
}

export { getAuthor, saveAuthor, getAuthorById }
