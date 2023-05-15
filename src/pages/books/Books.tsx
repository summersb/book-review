import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { getAuthor, getBooks } from '~/api'
import { type Author, AuthorMap, type AuthorRecord, type Book } from '~/type'
import BookList, { BookListType } from '~/pages/books/BookList'
import useAuth from '~/hooks/useAuth'

const Books = (): JSX.Element => {
  const [map, setMap] = useState<AuthorMap>({})
  const { data: reviewList, isSuccess: bookLoaded } = useQuery({
    queryKey: ['Book'],
    queryFn: getBooks,
    onError: (err: Error) => {
      alert(err.message)
    },
    staleTime: 100_000,
  })

  const { isSuccess: authorLoaded } = useQuery({
    queryKey: ['Author'],
    queryFn: getAuthor,
    onSuccess: (data) => {
      const map: AuthorMap = {}
      data?.docs
        .map((doc): AuthorRecord => ({ id: doc.id, author: doc.data() as Author }))
        .forEach((record) => {
          map[record.id] = `${record.author.lastName}, ${record.author.firstName}`
        })
      setMap(map)
    },
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
  })

  if (!bookLoaded || !authorLoaded) {
    return <>Loading</>
  }

  return (
    <div>
      <BookList
        rows={reviewList?.docs.map((row): BookListType => {
          return {
            book: row.data(),
            doc: row,
          }
        })}
        authors={map}
      />
    </div>
  )
}

export default Books
