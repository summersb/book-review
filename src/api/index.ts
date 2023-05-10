import { getBooks, getBooksByAuthor, saveBook, deleteBook } from './bookApi'
import { auth, db, app } from './firebase'
import { getAuthor, saveAuthor, getAuthorById, deleteAuthor, updateAuthor } from './authorApi'

export {
  getAuthor,
  saveAuthor,
  getAuthorById,
  deleteBook,
  getBooks,
  getBooksByAuthor,
  saveBook,
  auth,
  db,
  app,
  deleteAuthor,
  updateAuthor,
}
