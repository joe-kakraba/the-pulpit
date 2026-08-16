import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import SermonCard from '../components/SermonCard'

export default function Sermons() {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase
      .from('sermons')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        if (!mounted) return
        setSermons(data || [])
        setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return (
    <section className="section container">
      <h1 className="section-title">All Messages</h1>
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : sermons.length === 0 ? (
        <div className="empty-state">No sermons published yet.</div>
      ) : (
        <div className="sermon-grid">
          {sermons.map((s) => (
            <SermonCard sermon={s} key={s.id} />
          ))}
        </div>
      )}
    </section>
  )
}
