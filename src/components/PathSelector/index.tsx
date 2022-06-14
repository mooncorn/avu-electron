import { FileFilter } from 'electron'

interface PathSelectorProps {
  type: 'directory' | 'file'
  fileFilters?: FileFilter[]
  title?: string
  dialogButtonLabel?: string
  buttonLabel?: string
  setPath: (path: string) => void
}

export const PathSelector = ({
  setPath,
  type,
  fileFilters,
  title,
  buttonLabel,
  dialogButtonLabel,
}: PathSelectorProps) => {
  const handleSelect = async () => {
    if (type === 'file') {
      const path = await window.Main.selectFile({
        filters: fileFilters,
        title,
        buttonLabel: dialogButtonLabel,
      })

      if (path) setPath(path)
    } else if (type === 'directory') {
      const path = await window.Main.selectDirectory()

      if (path) setPath(path)
    }
  }

  return (
    <button className="btn btn-primary" onClick={handleSelect}>
      {buttonLabel ?? 'Select'}
    </button>
  )
}
