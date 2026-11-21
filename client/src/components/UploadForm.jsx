// UploadForm: lets a logged-in user upload a photo.
// Props: onUploaded - callback that tells the parent page to refresh the gallery.

import { useState } from 'react'
import api from '../api/axios'

function UploadForm({ onUploaded }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Send the file and text fields as multipart FormData to POST /api/photos.
  // The field name "photo" must match upload.single("photo") on the server.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please select an image.')
      return
    }

    const data = new FormData()
    data.append('photo', file)
    data.append('title', title)
    data.append('description', description)

    setLoading(true)

    try {
      await api.post('/photos', data)

      setTitle('')
      setDescription('')
      setFile(null)

      e.target.reset()

      if (onUploaded) {
        onUploaded()
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'Upload failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="upload-card">
      <div className="upload-heading">
        <div>
          <p className="eyebrow">Share a memory</p>
          <h2>Upload a Photo</h2>
        </div>
        <span className="upload-icon">＋</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="upload-title">Photo Title *</label>
          <input
            id="upload-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={2}
            maxLength={100}
            required
            placeholder="Give your photo a title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="upload-description">Description</label>
          <textarea
            id="upload-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows="3"
            placeholder="Tell us the story behind this photo..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="upload-file">Choose Image *</label>
          <input
            id="upload-file"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />
          <small>JPEG, PNG, GIF, or WebP. Maximum size: 5 MB.</small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </section>
  )
}

export default UploadForm
