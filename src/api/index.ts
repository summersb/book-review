import { getBooks, getBooksByAuthor, saveBook } from './bookApi'
import { auth, db } from './firebase'
import { getAuthor, saveAuthor, getAuthorById } from './authorApi'

export { getAuthor, saveAuthor, getAuthorById, getBooks, getBooksByAuthor, saveBook, auth, db }
