import { useState } from 'react'
import { PathSelector } from './components/PathSelector'

export function App() {
  const [path, setPath] = useState('')

  return (
    <>
      <span>{path}</span>
      <PathSelector
        type="file"
        fileFilters={[{ extensions: ['json'], name: 'JSON File' }]}
        setPath={setPath}
      />
    </>
  )
}
