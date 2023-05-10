import Paper from '@mui/material/Paper'
import { useQuery } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import UserContext from '../../context/UserContext'
import { getAuthorById, getBooksByAuthor } from '~/api'
import { AuthorMap, type Author, type Book } from '~/type'
import { useParams } from 'react-router-dom'
import NoUser from '../home/NoUser'
import BookList, { BookListType } from '~/pages/books/BookList'

type BooksByAuthorProps = {}

const BooksByAuthor = (props: BooksByAuthorProps): JSX.Element => {
  const ctx = useContext(UserContext)
  const [author, setAuthor] = useState<Author | null>(null)
  const { id } = useParams()

  const { data: bookList, isSuccess: bookLoaded } = useQuery({
    queryKey: ['Book', id],
    queryFn: () => getBooksByAuthor(id as string),
    enabled: ctx?.user !== undefined && id !== undefined,
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
  })

  const { isSuccess: authorLoaded } = useQuery({
    queryKey: ['Author', id],
    queryFn: () => getAuthorById(id as string),
    onSuccess: (data) => {
      setAuthor(data)
    },
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
    enabled: ctx?.user !== undefined && id !== undefined,
  })

  if (ctx?.user === undefined) {
    return <NoUser />
  }

  if (!bookLoaded || !authorLoaded) {
    return <>Loading</>
  }

  const map: AuthorMap = {}
  if (id !== undefined && author !== null) {
    map[id] = `${author.lastName}, ${author.firstName}`
  }

  return (
    <div>
      <Paper>
        <h3>{`${author?.lastName}, ${author?.firstName}`}</h3>
        {author != null && (
          <BookList
            rows={bookList?.docs.map((row): BookListType => {
              return {
                book: row.data(),
                doc: row,
              }
            })}
            authors={map}
          />
        )}
      </Paper>
    </div>
  )
}

export default BooksByAuthor
