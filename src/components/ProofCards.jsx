export default function ProofCards({ cards }) {
  const list = Array.isArray(cards) ? cards : []
  if (list.length === 0) return null

  return (
    <div className="proof-row">
      {list.map((card, i) => (
        <div className="proof-card" key={i}>
          <div className="proof-stat">{card.stat}</div>
          <div className="proof-label">{card.label}</div>
        </div>
      ))}
    </div>
  )
}
