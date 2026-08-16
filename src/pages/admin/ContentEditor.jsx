import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

const SECTIONS = [
  {
    key: 'hero',
    label: 'Hero Section',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow text' },
      { name: 'headline', label: 'Headline' },
      { name: 'subheadline', label: 'Subheadline', textarea: true },
      { name: 'cta_label', label: 'Button label' },
    ],
  },
  {
    key: 'newsletter_cta',
    label: 'Newsletter Section',
    fields: [
      { name: 'headline', label: 'Headline' },
      { name: 'subtext', label: 'Subtext', textarea: true },
    ],
  },
  {
    key: 'about',
    label: 'About Page',
    fields: [
      { name: 'headline', label: 'Headline' },
      { name: 'body', label: 'Body text', textarea: true },
    ],
  },
]

export default function ContentEditor() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState(null)
  const [savedKey, setSavedKey] = useState(null)

  useEffect(() => {
    supabase
      .from('site_content')
      .select('section_key, content')
      .then(({ data: rows }) => {
        const map = {}
        ;(rows || []).forEach((r) => { map[r.section_key] = r.content || {} })
        setData(map)
        setLoading(false)
      })
  }, [])

  function updateField(sectionKey, fieldName, value) {
    setData((d) => ({
      ...d,
      [sectionKey]: { ...(d[sectionKey] || {}), [fieldName]: value },
    }))
  }

  async function saveSection(sectionKey) {
    setSavingKey(sectionKey)
    setSavedKey(null)
    const { error } = await supabase
      .from('site_content')
      .update({ content: data[sectionKey] || {} })
      .eq('section_key', sectionKey)
    setSavingKey(null)
    if (!error) {
      setSavedKey(sectionKey)
      setTimeout(() => setSavedKey(null), 2000)
    }
  }

  if (loading) return <div className="loading-state">Loading...</div>

  return (
    <div>
      <h1>Site Content</h1>
      {SECTIONS.map((section) => (
        <div className="admin-card" key={section.key}>
          <h2 style={{ marginTop: 0 }}>{section.label}</h2>
          {section.fields.map((field) => (
            <div className="field-row" key={field.name}>
              <label>{field.label}</label>
              {field.textarea ? (
                <textarea
                  rows={3}
                  value={data[section.key]?.[field.name] || ''}
                  onChange={(e) => updateField(section.key, field.name, e.target.value)}
                />
              ) : (
                <input
                  value={data[section.key]?.[field.name] || ''}
                  onChange={(e) => updateField(section.key, field.name, e.target.value)}
                />
              )}
            </div>
          ))}
          <button
            className="btn btn-primary"
            onClick={() => saveSection(section.key)}
            disabled={savingKey === section.key}
          >
            {savingKey === section.key ? 'Saving...' : 'Save'}
          </button>
          {savedKey === section.key && (
            <span className="form-msg success" style={{ marginLeft: 12 }}>Saved ✓</span>
          )}
        </div>
      ))}
    </div>
  )
}
