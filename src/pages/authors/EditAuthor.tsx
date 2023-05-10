import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Author } from '~/type'
import { WideTextField } from '~/components'
import Button from '@mui/material/Button'
import { getAuthorById, updateAuthor } from '~/api'
import NoUser from '../home/NoUser'
import UserContext from '~/context/UserContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

const EditAuthor = (): JSX.Element => {
  const [saving, setSaving] = useState<boolean>(false)
  const ctx = useContext(UserContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Author>()

  const { data: reviewList } = useQuery({
    queryKey: ['Author', id],
    queryFn: () => getAuthorById(id as string),
    onSuccess: (a) => {
      if (a) {
        setValue('firstName', a.firstName)
        setValue('lastName', a.lastName)
      }
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

  if (id === undefined) {
    navigate('/Authors')
  }

  const handleSave = (author: Author) => {
    setSaving(true)
    const startTime = new Date().getTime()
    updateAuthor(id as string, author)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['Author'] })
        queryClient.invalidateQueries({ queryKey: ['Author', id] })
        navigate('/Authors')
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
          <WideTextField
            label="First Name"
            defaultValue
            {...register('firstName')}
            error={!(errors.firstName == null)}
          />
        </Grid>
        <Grid item xs={12}>
          <WideTextField
            label="Last Name"
            defaultValue
            {...register('lastName', { required: true })}
            error={!(errors.lastName == null)}
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ float: 'right' }}>
            <Button variant="outlined" onClick={() => navigate('/Authors')}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleSubmit(handleSave)}>
              Update
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default EditAuthor
