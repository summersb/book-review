import * as React from 'react'
import { useContext } from 'react'
import NoUser from './NoUser'
import userContext from '~/context/UserContext'

const Home = (): JSX.Element => {
  const ctx = useContext(userContext)

  if (ctx?.user === undefined) {
    return <NoUser />
  }

  return (
    <div>
      <h2>Collection of books I have read</h2>
    </div>
  )
}

export default Home
