import { useNavigate, Link } from 'react-router-dom'
import { UserButton, useAuth } from '@clerk/clerk-react'
import { useApp } from '../context/AppContext'
import { Zap } from 'lucide-react'

const Navbar = () => {
  const { credits } = useApp()
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      height: '64px',
      background: 'rgba(9,9,11,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} fill="currentColor" style={{ color: '#a855f7' }} />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.3px' }}>
            SiteBuilder <span style={{ color: '#a855f7' }}>AI</span>
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Home</Link>
          {isSignedIn && (
            <Link to="/dashboard" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Dashboard</Link>
          )}
          <Link to="/pricing" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Pricing</Link>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isSignedIn && (
            <div
              onClick={() => navigate('/pricing')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px',
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '999px',
                cursor: 'pointer',
              }}
            >
              <Zap size={13} fill="currentColor" style={{ color: '#a855f7' }} />
              <span style={{ color: '#c4b5fd', fontSize: '13px', fontWeight: 600 }}>{credits} credits</span>
            </div>
          )}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button
              onClick={() => navigate('/sign-in')}
              style={{
                padding: '8px 18px',
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar