import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useContext, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DeleteIcon from '@mui/icons-material/Delete'
import UserContext from '~/context/UserContext'
import { deleteBook, getAuthor } from '~/api'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { Author } from '~/type'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import NoUser from '~/pages/home/NoUser'

const Authors = (): JSX.Element => {
  const ctx = useContext(UserContext)
  const [deleting, setIsDeleting] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [author, setAuthor] = useState<QueryDocumentSnapshot<DocumentData>>()
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  const { data: reviewList } = useQuery({
    queryKey: ['Author'],
    queryFn: getAuthor,
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
    enabled: ctx?.user !== undefined,
  })

  const handleDeleteAuthor = (): void => {
    if (!author) {
      return
    }
    setConfirmDelete(false)
    setIsDeleting(true)
    const startTime = new Date().getTime()
    deleteBook(author.ref)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['Author'] })
      })
      .finally(() => {
        let delay = 500
        const now = new Date().getTime()
        if (now - startTime < 500) {
          delay = 500 - (now - startTime)
        }
        setTimeout(() => {
          setIsDeleting(false)
        }, delay)
      })
  }

  const handleClose = (): void => {
    setConfirmDelete(false)
  }

  if (ctx?.user === undefined) {
    return <NoUser />
  }
  return (
    <div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deleting}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={confirmDelete}
        onClose={handleClose}
        PaperComponent={Paper}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete {author?.data().lastName}, {author?.data().firstName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAuthor}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Paper>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Books</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewList?.docs.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.data().firstName}
                </TableCell>
                <TableCell>{row.data().lastName}</TableCell>
                <TableCell>
                  <Link component={RouterLink} to={`/Author/${row.id}/Books`}>
                    Show Books
                  </Link>
                </TableCell>
                <TableCell>
                  <DeleteIcon
                    onClick={() => {
                      setAuthor(row)
                      setConfirmDelete(true)
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

export default Authors
