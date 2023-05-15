import Paper from '@mui/material/Paper'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getAuthorById, getBooksByAuthor } from '~/api'
import { type Author, AuthorMap, type Book } from '~/type'
import { useParams } from 'react-router-dom'
import BookList, { BookListType } from '~/pages/books/BookList'

const BooksByAuthor = (): JSX.Element => {
  const [author, setAuthor] = useState<Author | null>(null)
  const { id } = useParams()

  useEffect(() => {
    document.title = 'Book Review - Books by Author'
  }, [])

  const { data: bookList, isSuccess: bookLoaded } = useQuery({
    queryKey: ['Book', id],
    queryFn: () => getBooksByAuthor(id as string),
    enabled: id !== undefined,
    onError: (err: Error) => {
      alert(err.message)
    },
    staleTime: 100_000,
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
    staleTime: 100_000,
    retry: false,
    enabled: id !== undefined,
  })

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
