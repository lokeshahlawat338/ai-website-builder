import { useNavigate, Link } from 'react-router-dom'
import { UserButton, useAuth } from '@clerk/clerk-react'
import { useApp } from '../context/AppContext'
import { Zap } from 'lucide-react'

const Navbar = () => {
  const { credits } = useApp()
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl no-underline">
          <Zap className="text-purple-500" size={24} fill="currentColor" />
          <span>SiteBuilder <span className="text-purple-500">AI</span></span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-zinc-400 hover:text-white text-sm transition-colors no-underline">Home</Link>
          {isSignedIn && (
            <Link to="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors no-underline">Dashboard</Link>
          )}
          <Link to="/pricing" className="text-zinc-400 hover:text-white text-sm transition-colors no-underline">Pricing</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isSignedIn && (
            <div 
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950 border border-purple-800 rounded-full cursor-pointer hover:bg-purple-900 transition-colors"
            >
              <Zap size={14} className="text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">{credits} credits</span>
            </div>
          )}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button 
              onClick={() => navigate('/sign-in')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
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