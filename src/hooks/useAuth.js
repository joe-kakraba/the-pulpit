import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      checkAdmin(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      checkAdmin(newSession)
    })

    async function checkAdmin(s) {
      if (!s) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', s.user.id)
        .maybeSingle()
      if (!mounted) return
      setIsAdmin(!!data && !error)
      setLoading(false)
    }

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return { session, isAdmin, loading }
}
