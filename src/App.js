import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Auth from './components/Auth'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div style={{ padding: '2rem' }}>
        <h3 style={{ textAlign: 'center' }}>Test your <a href="https://docs.airtop.ai/guides/how-to/saving-a-profile" target="_blank" rel="noopener noreferrer">Airtop Profile</a></h3>
        <p style={{ textAlign: 'center' }}>You don't need to use real credentials, just use any email and password to sign up.</p>
        <Auth />
      </div>
    )
  }
  else {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Welcome!</h2>
        <p>You are logged in as <strong>{session.user.email}</strong></p>
        <p>If you see this page it means your authentication is working.</p>
        <p style={{ marginTop: '2rem', color: '#777777' }}>You can sign out by clicking the button below.</p>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          style={{
            padding: '0.5rem 1rem',
            minWidth: '300px',
            backgroundColor: 'rgb(255, 141, 75)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    )
  }
}