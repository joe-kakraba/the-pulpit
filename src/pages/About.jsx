import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function About() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    let mounted = true
    supabase
      .from('site_content')
      .select('content')
      .eq('section_key', 'about')
      .maybeSingle()
      .then(({ data }) => {
        if (mounted) setContent(data?.content || {})
      })
    return () => { mounted = false }
  }, [])

  return (
    <section className="section container" style={{ maxWidth: 720 }}>
      <h1 className="section-title">{content?.headline || 'About The Pulpit'}</h1>
      <p style={{ color: 'var(--text-mid)', fontSize: '1.05rem', lineHeight: 1.7 }}>
        {content?.body || ''}
      </p>
    </section>
  )
}
