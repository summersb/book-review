import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useQuery } from '@tanstack/react-query'
import { collectionGroup, type DocumentData, getDocs, type QuerySnapshot } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import UserContext from '../../context/UserContext'
import { LargeTable, SmallTable } from '../../components'
import { getAuthor, db } from '../../api'
import { type Author, type AuthorRecord, type Book, type BookRecord } from '../../type'

const getBooks = async (): Promise<QuerySnapshot<DocumentData>> => {
  return await getDocs(collectionGroup(db, 'Book'))
}

type AuthorMap = Record<string, string>

const Books = (): JSX.Element => {
  const ctx = useContext(UserContext)
  const [map, setMap] = useState<AuthorMap>({})

  const { data: reviewList, isSuccess: bookLoaded } = useQuery({
    queryKey: ['Book'],
    queryFn: getBooks,
    onError: (err: Error) => {
      alert(err.message)
    },
    enabled: ctx?.user !== undefined,
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
    enabled: ctx?.user !== undefined,
  })

  if (ctx?.user === undefined) {
    return <>No User</>
  }

  if (!bookLoaded || !authorLoaded) {
    return <>Loading</>
  }

  return (
    <div>
      <LargeTable component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Series</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewList?.docs.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{map[row.data().authorId]}</TableCell>
                <TableCell>{row.data().title}</TableCell>
                <TableCell>{row.data().rating}</TableCell>
                <TableCell>{row.data().series}</TableCell>
                <TableCell>{row.data().number}</TableCell>
                <TableCell>{row.data().genre}</TableCell>
                <TableCell>{row.data().bookType}</TableCell>
                <TableCell>Show Review</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </LargeTable>
      <SmallTable>
        <h2>Books</h2>
        {reviewList?.docs
          .map((row): BookRecord => ({ id: row.id, book: row.data() }))
          .map((data) => (
            <div key={data.id}>
              <h3>{data.book.title}</h3>
              <dl>
                <dt>Rating</dt>
                <dd>{data.book.rating}</dd>
                <dt>Author</dt>
                <dd>{map[data.book.authorId]}</dd>
                {data.book.series !== '' && (
                  <>
                    <dt>Series</dt>
                    <dd>{data.book.series}</dd>
                    <dt>Number</dt>
                    <dd>{data.book.number}</dd>
                  </>
                )}
                {data.book.genre !== '' && (
                  <>
                    <dt>Genre</dt>
                    <dd>{data.book.genre}</dd>
                  </>
                )}
                {data.book.bookType !== undefined && (
                  <>
                    <dt>Type</dt>
                    <dd>{data.book.bookType}</dd>
                  </>
                )}
                {data.book.review !== '' && (
                  <>
                    <dt>Review</dt>
                    <dd>Show Review</dd>
                  </>
                )}
              </dl>
            </div>
          ))}
      </SmallTable>
    </div>
  )
}

export default Books
