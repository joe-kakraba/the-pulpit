import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

const emptyForm = {
  id: null,
  title: '',
  slug: '',
  speaker: '',
  scripture_ref: '',
  description: '',
  audio_url: '',
  video_url: '',
  thumbnail_url: '',
  featured: false,
  published: true,
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function SermonManager() {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadSermons() {
    setLoading(true)
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .order('published_at', { ascending: false })
    if (!error) setSermons(data || [])
    setLoading(false)
  }

  useEffect(() => { loadSermons() }, [])

  function startEdit(sermon) {
    setForm(sermon)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startNew() {
    setForm(emptyForm)
  }

  function updateField(key, value) {
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (key === 'title' && !f.id) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      speaker: form.speaker,
      scripture_ref: form.scripture_ref,
      description: form.description,
      audio_url: form.audio_url,
      video_url: form.video_url,
      thumbnail_url: form.thumbnail_url,
      featured: form.featured,
      published: form.published,
    }

    const result = form.id
      ? await supabase.from('sermons').update(payload).eq('id', form.id)
      : await supabase.from('sermons').insert(payload)

    setSaving(false)

    if (result.error) {
      setError(result.error.message)
    } else {
      setForm(emptyForm)
      loadSermons()
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this sermon? This cannot be undone.')) return
    await supabase.from('sermons').delete().eq('id', id)
    loadSermons()
  }

  return (
    <div>
      <h1>Sermons</h1>

      <form className="admin-card" onSubmit={handleSave}>
        <h2 style={{ marginTop: 0 }}>{form.id ? 'Edit Sermon' : 'New Sermon'}</h2>

        <div className="field-row">
          <label>Title</label>
          <input value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
        </div>
        <div className="field-row">
          <label>Slug (URL)</label>
          <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} required />
        </div>
        <div className="field-row">
          <label>Speaker</label>
          <input value={form.speaker || ''} onChange={(e) => updateField('speaker', e.target.value)} />
        </div>
        <div className="field-row">
          <label>Scripture Reference</label>
          <input value={form.scripture_ref || ''} onChange={(e) => updateField('scripture_ref', e.target.value)} />
        </div>
        <div className="field-row">
          <label>Description</label>
          <textarea rows={3} value={form.description || ''} onChange={(e) => updateField('description', e.target.value)} />
        </div>
        <div className="field-row">
          <label>Audio URL</label>
          <input value={form.audio_url || ''} onChange={(e) => updateField('audio_url', e.target.value)} />
        </div>
        <div className="field-row">
          <label>Video URL</label>
          <input value={form.video_url || ''} onChange={(e) => updateField('video_url', e.target.value)} />
        </div>
        <div className="field-row">
          <label>Thumbnail URL</label>
          <input value={form.thumbnail_url || ''} onChange={(e) => updateField('thumbnail_url', e.target.value)} />
        </div>
        <div className="field-row" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            style={{ width: 'auto' }}
            checked={!!form.featured}
            onChange={(e) => updateField('featured', e.target.checked)}
          />
          <label style={{ margin: 0 }}>Featured</label>
        </div>
        <div className="field-row" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            style={{ width: 'auto' }}
            checked={!!form.published}
            onChange={(e) => updateField('published', e.target.checked)}
          />
          <label style={{ margin: 0 }}>Published (visible on site)</label>
        </div>

        {error && <div className="form-msg error">{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : form.id ? 'Save Changes' : 'Create Sermon'}
          </button>
          {form.id && (
            <button type="button" className="btn btn-outline" onClick={startNew}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>All Sermons ({sermons.length})</h2>
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : sermons.length === 0 ? (
          <div className="empty-state">No sermons yet — add your first one above.</div>
        ) : (
          sermons.map((s) => (
            <div className="table-row" key={s.id}>
              <div>
                <div style={{ fontWeight: 600 }}>{s.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-low)' }}>
                  /{s.slug} {s.featured && '· Featured'} {!s.published && '· Draft'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => startEdit(s)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
