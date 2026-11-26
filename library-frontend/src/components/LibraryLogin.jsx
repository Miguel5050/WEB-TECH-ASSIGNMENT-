import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LibraryButton from './LibraryButton'

function LibraryLogin({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  function loginCheck() {
    if (userName === 'admin' && password === '12345') {
      onLoginSuccess()
      navigate('/main')
    } else {
      alert('Invalid user Name or password')
    }
  }

  return (
    <div style={{ border: '3px solid indigo', marginTop: '200px' }}>
      <div><h1>Sign In</h1></div>
      <label htmlFor="sign-in-username">Username:</label>
      <input
        id="sign-in-username"
        type="text"
        placeholder="Enter your username"
        value={userName}
        onChange={event => setUserName(event.target.value)}
      />
      <br />
      <label htmlFor="sign-in-password">Password:</label>
      <input
        id="sign-in-password"
        type="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <br />
      <div>
        <LibraryButton buttonLabel="LOGIN" buttonAction={loginCheck} />
      </div>
    </div>
  )
}

export default LibraryLogin
