import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">THE PULPIT</Link>
      <nav className="nav-links">
        <Link to="/sermons">Sermons</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  )
}
