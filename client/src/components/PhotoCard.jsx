// PhotoCard: reusable card for one photo in the gallery (grid or list view).
// Props: photo - one photo object returned by the API.

import { Link } from 'react-router-dom'

function PhotoCard({ photo }) {
  // Uploaded files are served by Express from /uploads (proxied by Vite in development)
  const imageUrl = `/uploads/${encodeURIComponent(photo.fileName)}`

  return (
    <article className="photo-card">
      <Link to={`/photos/${photo._id}`} className="photo-image-link">
        <img
          src={imageUrl}
          alt={photo.title}
          className="photo-card-image"
        />
      </Link>

      <div className="photo-card-content">
        <Link to={`/photos/${photo._id}`} className="photo-title">
          {photo.title}
        </Link>

        <p className="photo-description">
          {photo.description || 'No description provided.'}
        </p>

        <div className="photo-meta">
          <span>
            By {photo.userId?.firstName || 'Unknown'}
          </span>

          <span>
          {(photo.dateTime || photo.createdAt)
  ? new Date(photo.dateTime || photo.createdAt).toLocaleDateString()
  : ''}
          </span>
        </div>

        <Link
          to={`/photos/${photo._id}`}
          className="view-photo-link"
        >
          View Photo →
        </Link>
      </div>
    </article>
  )
}

export default PhotoCard
