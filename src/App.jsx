import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Sermons from './pages/Sermons'
import SermonDetail from './pages/SermonDetail'
import About from './pages/About'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import SermonManager from './pages/admin/SermonManager'
import ContentEditor from './pages/admin/ContentEditor'

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/sermons" element={<PublicLayout><Sermons /></PublicLayout>} />
      <Route path="/sermons/:slug" element={<PublicLayout><SermonDetail /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<SermonManager />} />
        <Route path="content" element={<ContentEditor />} />
      </Route>
    </Routes>
  )
}
