import StyledFirebaseAuth from './StyledFirebaseAuth'
import 'firebase/compat/auth'
import React, { useContext } from 'react'
import { auth } from '~/api'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import UserContext from '~/context/UserContext'

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/Authors',
  // We will display Google and Facebook as auth providers.
  signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID],
}

const Login = () => {
  const ctx = useContext(UserContext)
  const navigate = useNavigate()

  if (ctx?.user !== undefined) {
    navigate('/')
  }

  return (
    <div>
      <center>
        <p>Please sign-in:</p>
      </center>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  )
}

export default Login
