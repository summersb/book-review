import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  bgcolor: 'background.paper',
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
  const { id } = useParams()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
