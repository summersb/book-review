import { getBooks, getBooksByAuthor, saveBook, deleteBook } from './bookApi'
import { auth, db } from './firebase'
import { getAuthor, saveAuthor, getAuthorById, deleteAuthor } from './authorApi'

export { getAuthor, saveAuthor, getAuthorById, deleteBook, getBooks, getBooksByAuthor, saveBook, auth, db, deleteAuthor }
