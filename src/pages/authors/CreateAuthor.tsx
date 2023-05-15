import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Author } from '~/type'
import { WideTextField } from '~/components'
import Button from '@mui/material/Button'
import { saveAuthor } from '~/api'
import { useQueryClient } from '@tanstack/react-query'

const CreateAuthor = (): JSX.Element => {
  const [saving, setSaving] = useState<boolean>(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    document.title = 'Book Review - Create Author'
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Author>({
    defaultValues: {
      lastName: '',
      firstName: '',
    },
  })

  const handleSave = (author: Author) => {
    setSaving(true)
    const startTime = new Date().getTime()
    saveAuthor(author)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['Author'] })
        reset()
      })
      .catch((err) => {
        alert(err.message)
      })
      .finally(() => {
        let delay = 500
        const now = new Date().getTime()
        if (now - startTime < 500) {
          delay = 500 - (now - startTime)
        }
        setTimeout(() => {
          setSaving(false)
        }, delay)
      })
  }

  return (
    <div id="top">
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={saving}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <h3>Create Author</h3>
      <Grid container sx={{ padding: '20px', width: '100%' }}>
        <Grid item xs={12}>
          <WideTextField label="First Name" {...register('firstName')} error={!(errors.firstName == null)} />
        </Grid>
        <Grid item xs={12}>
          <WideTextField
            label="Last Name"
            {...register('lastName', { required: true })}
            error={!(errors.lastName == null)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" sx={{ float: 'right' }} onClick={handleSubmit(handleSave)}>
            Create
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default CreateAuthor
