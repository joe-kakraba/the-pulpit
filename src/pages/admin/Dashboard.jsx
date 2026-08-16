import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

export default function Dashboard() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div style={{ fontWeight: 800, marginBottom: 20 }}>THE PULPIT</div>
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Sermons
        </NavLink>
        <NavLink to="/admin/content" className={({ isActive }) => (isActive ? 'active' : '')}>
          Site Content
        </NavLink>
        <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
        <button
          className="btn btn-outline"
          style={{ marginTop: 20, width: '100%' }}
          onClick={handleLogout}
        >
          Log out
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
