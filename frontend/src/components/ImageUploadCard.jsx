import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

function ImageUploadCard({
  selectedFile,
  onFileChange,
  onSubmit,
  isUploading,
  canSubmit,
}) {
  const { t } = useTranslation()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [isCameraOpen])

  async function startLiveCamera() {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream
      setIsCameraOpen(true)
    } catch {
      setCameraError(t('camera_error'))
    }
  }

  function closeLiveCamera() {
    setIsCameraOpen(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  function captureFromLiveCamera() {
    if (!videoRef.current) return

    const video = videoRef.current
    const width = video.videoWidth || 1280
    const height = video.videoHeight || 720
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, width, height)

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })
        onFileChange({ target: { files: [file] } })
        closeLiveCamera()
      },
      'image/jpeg',
      0.92,
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{t('card_upload_title')}</h2>
      <p className="mt-1 text-sm text-slate-600">{t('card_upload_desc')}</p>

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="mt-4 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:font-medium file:text-white"
      />

      <p className="mt-4 text-sm font-medium text-slate-700">{t('or_capture')}</p>
      <button
        type="button"
        onClick={startLiveCamera}
        className="mt-2 inline-flex rounded-full border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
      >
        {t('start_camera')}
      </button>

      <p className="mt-2 text-xs text-slate-500">{t('camera_note')}</p>

      {cameraError ? (
        <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {cameraError}
        </p>
      ) : null}

      {isCameraOpen ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg border border-slate-200"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={captureFromLiveCamera}
              className="inline-flex rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white"
            >
              {t('capture_photo')}
            </button>
            <button
              type="button"
              onClick={closeLiveCamera}
              className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {t('close_camera')}
            </button>
          </div>
        </div>
      ) : null}

      {selectedFile ? (
        <p className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-700">
          {t('selected_file')}: {selectedFile.name}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || isUploading}
        className="mt-5 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? t('uploading') : t('run_ai')}
      </button>
    </section>
  )
}

export default ImageUploadCard

