import { useEffect, useState } from 'react'
import { PathSelector } from './components/PathSelector'

export function App() {
  const [clientSecretFilePath, setClientSecretFilePath] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = await window.Main.getStoredToken()
    if (token) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }

  // need a way to verify if user is authenticated
  const onAuthenticate = async () => {
    await window.Main.authenticate(clientSecretFilePath)

    await checkAuthStatus()
  }

  return (
    <>
      <h1>{loggedIn ? 'Logged In' : 'Not Logged In'}</h1>
      <span>{clientSecretFilePath}</span>
      <PathSelector
        type="file"
        fileFilters={[{ extensions: ['json'], name: 'JSON File' }]}
        setPath={setClientSecretFilePath}
      />
      <button
        className="btn btn-secondary"
        disabled={clientSecretFilePath === ''}
        onClick={onAuthenticate}
      >
        Authenticate
      </button>
    </>
  )
}
