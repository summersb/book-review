import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useContext } from 'react'
import UserContext from '../../context/UserContext'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import LargeTable from '../../components/LargeTable'
import SmallTable from '../../components/SmallTable'
import { getAuthor } from '../../api'

const FloatRight = styled('span')(({ theme }) => ({
  float: 'right',
}))

const Authors = (): JSX.Element => {
  const ctx = useContext(UserContext)

  const { data: reviewList } = useQuery({
    queryKey: ['Author'],
    queryFn: getAuthor,
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
    enabled: ctx?.user !== undefined,
  })

  if (ctx?.user === undefined) {
    return <>No User</>
  }
  return (
    <div>
      <LargeTable component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Books</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewList?.docs.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.data().firstName}
                </TableCell>
                <TableCell>{row.data().lastName}</TableCell>
                <TableCell>Show</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </LargeTable>
      <SmallTable>
        <h2>Authors</h2>
        {reviewList?.docs.map((row) => (
          <div key={row.id}>
            <h3>
              {`${row.data().firstName} ${row.data().lastName}`}
              <FloatRight>Books</FloatRight>
            </h3>
            <dl>
              <dt>First</dt>
              <dd>{row.data().firstName}</dd>
              <dt>Last</dt>
              <dd>{row.data().lastName}</dd>
            </dl>
          </div>
        ))}
      </SmallTable>
    </div>
  )
}

export default Authors
