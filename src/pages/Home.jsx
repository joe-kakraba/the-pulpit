import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import HeroSection from '../components/HeroSection'
import ProofCards from '../components/ProofCards'
import NewsletterForm from '../components/NewsletterForm'
import SermonCard from '../components/SermonCard'

export default function Home() {
  const [content, setContent] = useState({})
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      const [contentRes, sermonsRes] = await Promise.all([
        supabase.from('site_content').select('section_key, content'),
        supabase
          .from('sermons')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(3),
      ])

      if (!mounted) return

      if (contentRes.data) {
        const map = {}
        contentRes.data.forEach((row) => {
          map[row.section_key] = row.content
        })
        setContent(map)
      }
      if (sermonsRes.data) setFeatured(sermonsRes.data)
      setLoading(false)
    }

    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="loading-state">Loading...</div>

  return (
    <>
      <HeroSection content={content.hero} />
      <ProofCards cards={content.proof_cards} />

      <section className="section container">
        <h2 className="section-title">Recent Messages</h2>
        {featured.length === 0 ? (
          <div className="empty-state">No sermons published yet.</div>
        ) : (
          <div className="sermon-grid">
            {featured.map((s) => (
              <SermonCard sermon={s} key={s.id} />
            ))}
          </div>
        )}
      </section>

      <section className="section container">
        <NewsletterForm content={content.newsletter_cta} />
      </section>
    </>
  )
}
