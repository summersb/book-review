import { styled } from '@mui/material/styles'

const SmallTable = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}))

export default SmallTable
