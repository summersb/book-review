import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { type Author, type AuthorRecord, type Book } from '@/type'
import { getAuthor, saveBook } from '@/api'
import { useQuery } from '@tanstack/react-query'
import React, { type ChangeEvent, useContext, useState } from 'react'
import UserContext from '../../context/UserContext'
import Rating from '@mui/material/Rating'
import StarIcon from '@mui/icons-material/Star'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { useForm } from 'react-hook-form'

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  variant: 'outlined',
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
}))

const labels: Record<string, string> = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
}

const getLabelText = (value: number): string => {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`
}

type AuthorMap = Record<string, string>

const CreateBook = (): JSX.Element => {
  const [hover, setHover] = React.useState<number>(-1)
  const [authorMap, setAuthorMap] = useState<AuthorMap>({})
  const [saving, setSaving] = useState<boolean>(false)
  const ctx = useContext(UserContext)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Book>()

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
      setAuthorMap(map)
    },
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
    enabled: ctx?.user !== undefined,
  })

  console.log('book.title', getValues('title'))
  console.log('book.series', getValues('series'))
  console.log('book.number', getValues('number'))
  console.log('book.review', getValues('review'))
  console.log('book.bookType', getValues('bookType'), errors.bookType)
  console.log('book.rating', getValues('rating'))
  console.log('book.authorId', getValues('authorId'))
  const handleSave = (book: Book): void => {
    setSaving(true)
    console.log('saving', book)
    saveBook(book)
      .then(() => {
        console.log('Rest book')
        reset()
      })
      .catch((err) => {
        alert(err.message)
      })
      .finally(() => {
        setSaving(false)
      })
  }

  const labelIndex: number = hover !== -1 ? hover : getValues('rating') === undefined ? hover : getValues('rating')

  return (
    <div id="top">
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={saving}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <h3>Create Book</h3>
      <form>
        <Grid container sx={{ padding: '20px', width: '100%' }}>
          <Grid item xs={12} lg={6}>
            <Grid item xs={12}>
              <StyledFormControl>
                <InputLabel>Author</InputLabel>
                <Select
                  label="Author"
                  defaultValue=""
                  {...register('authorId', { required: true })}
                  error={!(errors.authorId == null)}
                >
                  {authorLoaded &&
                    Object.keys(authorMap).map((key) => (
                      <MenuItem key={key} value={key}>
                        {authorMap[key]}
                      </MenuItem>
                    ))}
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12}>
              <StyledFormControl>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Book Type"
                  defaultValue=""
                  {...register('bookType', { required: true })}
                  error={!(errors.bookType == null)}
                >
                  <MenuItem key="ebook" value="Ebook">
                    EBook
                  </MenuItem>
                  <MenuItem key="paper" value="Paper">
                    Paper
                  </MenuItem>
                  <MenuItem key="audio" value="Audio">
                    Audio
                  </MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                id="title"
                label="Title"
                fullWidth
                {...register('title', { required: true })}
                error={!(errors.title == null)}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                id="series"
                label="Series"
                fullWidth
                margin="dense"
                {...register('series')}
                error={!(errors.series == null)}
              />
            </Grid>
            {getValues('series') !== '' && (
              <Grid item xs={12}>
                <StyledTextField id="number" type="number" label="Number" {...register('number')} />
              </Grid>
            )}
            <Grid item xs={12}>
              <StyledFormControl>
                <Box
                  sx={{
                    width: 400,
                    height: '3.5em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InputLabel>Rating</InputLabel>
                  <Rating
                    name="rating"
                    value={getValues('rating') ?? -1}
                    precision={1}
                    getLabelText={getLabelText}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    onChange={(event, newValue) => {
                      if (newValue == null) {
                        setValue('rating', -1)
                      } else if (newValue > -1 && newValue < 6) {
                        const v = newValue as keyof Book['rating']
                        console.log('rating', v, newValue)
                        setValue('rating', v)
                      }
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover)
                    }}
                  />
                  <Box
                    sx={{
                      ml: 2,
                      width: '50px',
                    }}
                  >
                    {labels[labelIndex]}
                  </Box>
                </Box>
              </StyledFormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid item xs={12}>
              <StyledTextField label="Review" multiline rows={13} {...register('review')} />
            </Grid>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Button variant="outlined" sx={{ float: 'right' }} onClick={handleSubmit(handleSave)}>
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default CreateBook
