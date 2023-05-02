import { collection, type DocumentData, getDocs, type QuerySnapshot } from 'firebase/firestore'
import { type Author } from '../type'
import { db } from './firebase'

const converter = {
  toFirestore: (data: Author) => data,
  fromFirestore: (snap: QuerySnapshot) => snap.data() as Author,
}

const getAuthor = async (): Promise<QuerySnapshot<DocumentData>> => {
  return await getDocs(collection(db, 'Author')) // .withConverter(converter)
}

export { getAuthor }
