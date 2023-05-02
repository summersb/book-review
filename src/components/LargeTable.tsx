import { styled } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'

const LargeTable = styled(TableContainer)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))

export default LargeTable
