import { useState } from 'react'
import ImageUploadCard from '../components/ImageUploadCard'

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [info, setInfo] = useState('')

  function handleFileChange(event) {
    setSelectedFile(event.target.files?.[0] || null)
    setInfo('')
  }

  function handleSubmit() {
    if (!selectedFile) return
    setInfo('Image selected successfully. You can connect backend upload API anytime.')
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div>
  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Step 2 of 2
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Upload Image</h1>
        <p className="mt-1 text-sm text-slate-600">
          Clear and focused photos give better screening quality.
        </p>
      </div>

      {info ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {info}
        </div>
      ) : null}

      <ImageUploadCard
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        isUploading={false}
        canSubmit={Boolean(selectedFile)}
      />
    </div>
  )
}

export default UploadPage
