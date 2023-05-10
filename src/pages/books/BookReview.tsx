import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import UserContext from '~/context/UserContext'
import NoUser from '../home/NoUser'

const style = {
  position: 'absolute' as 'absolute',
  top: '25%',
  left: '25%',
  transform: 'translate(-25%, -25%)',
  width: '75%',
  height: '75%',
  bgcolor: 'background.paper',
  overflow: 'auto',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'auto',
}

type BookReviewProps = {
  review: string
}

const BookReview: React.FC<BookReviewProps> = (props: BookReviewProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const ctx = useContext(UserContext)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (ctx?.user === undefined) {
    return <NoUser />
  }

  return (
    <div>
      <Button onClick={handleOpen}>Show Review</Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-book-review">
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Review
          </Typography>
          <Typography sx={{ mt: 2 }}>{props.review}</Typography>
        </Box>
      </Modal>
    </div>
  )
}

export default BookReview
