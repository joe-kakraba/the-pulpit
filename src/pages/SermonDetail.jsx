import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function SermonDetail() {
  const { slug } = useParams()
  const [sermon, setSermon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let mounted = true
    supabase
      .from('sermons')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return
        if (!data) setNotFound(true)
        else setSermon(data)
        setLoading(false)
      })
    return () => { mounted = false }
  }, [slug])

  if (loading) return <div className="loading-state">Loading...</div>
  if (notFound) {
    return (
      <div className="section container empty-state">
        Sermon not found. <Link to="/sermons">Back to all messages</Link>
      </div>
    )
  }

  return (
    <section className="section container" style={{ maxWidth: 720 }}>
      <Link to="/sermons" style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>
        ← All messages
      </Link>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '16px 0 6px' }}>
        {sermon.title}
      </h1>
      <div className="sermon-meta" style={{ marginBottom: 20 }}>
        {sermon.speaker || 'The Pulpit'}
        {sermon.scripture_ref ? ` · ${sermon.scripture_ref}` : ''}
      </div>

      {sermon.video_url && (
        <div style={{ marginBottom: 20 }}>
          <video controls style={{ width: '100%', borderRadius: 14 }} src={sermon.video_url} />
        </div>
      )}

      {sermon.audio_url && !sermon.video_url && (
        <audio controls style={{ width: '100%', marginBottom: 20 }} src={sermon.audio_url} />
      )}

      {sermon.description && (
        <p style={{ color: 'var(--text-mid)', fontSize: '1.05rem', lineHeight: 1.7 }}>
          {sermon.description}
        </p>
      )}
    </section>
  )
}
