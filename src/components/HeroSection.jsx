import { Link } from 'react-router-dom'

export default function HeroSection({ content }) {
  const c = content || {}
  return (
    <section className="hero">
      {c.eyebrow && <div className="hero-eyebrow">{c.eyebrow}</div>}
      <h1>{c.headline || 'For the weary soul looking for peace'}</h1>
      {c.subheadline && <p>{c.subheadline}</p>}
      <Link to="/sermons" className="btn btn-primary">
        {c.cta_label || 'Listen Now'}
      </Link>
    </section>
  )
}
