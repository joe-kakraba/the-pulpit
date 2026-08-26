import { Link } from 'react-router-dom'

export default function SermonCard({ sermon }) {
  return (
    <Link to={`/sermons/${sermon.slug}`} className="sermon-card">
      {sermon.thumbnail_url ? (
        <img className="sermon-thumb" src={sermon.thumbnail_url} alt={sermon.title} />
      ) : (
        <div className="sermon-thumb" />
      )}
      <div className="sermon-body">
        {sermon.featured && <span className="featured-badge">Featured</span>}
        <div className="sermon-title">{sermon.title}</div>
        <div className="sermon-meta">{sermon.speaker || 'The Pulpit'}</div>
        {sermon.scripture_ref && (
          <div className="sermon-scripture">{sermon.scripture_ref}</div>
        )}
        {sermon.description && (
        <p style={{ color: 'var(--text-hi)', fontSize: '1.05rem', lineHeight: 1.7, textAlign: 'justify', whiteSpace: 'pre-line' }}>
          {sermon.description}
        </p>
      )}      
      </div>
    </Link>
  )
}
