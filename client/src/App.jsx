import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { setAuthToken, getUserProfile } from './lib/api'
import api from './lib/api'

const DashboardPage = () => {
  const { getToken } = useAuth()
  const [user, setUser] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [credits, setCredits] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getToken()
      setAuthToken(token)
      const response = await getUserProfile()
      setUser(response.data)
      setCredits(response.data.credits)
    }
    fetchUser()
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError('')
    try {
      const token = await getToken()
      setAuthToken(token)
      const response = await api.post('/api/v1/generate', { prompt })
      setGeneratedHTML(response.data.project.generatedCode)
      setCredits(response.data.remainingCredits)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{display:'flex',height:'100vh',background:'#09090b',color:'white'}}>
      {/* Left Panel */}
      <div style={{width:'400px',padding:'24px',borderRight:'1px solid #27272a',display:'flex',flexDirection:'column',gap:'16px'}}>
        <h2 style={{margin:0,color:'#a855f7'}}>⚡ AI Website Builder</h2>
        <div style={{padding:'8px 12px',background:'#18181b',borderRadius:'8px',fontSize:'14px'}}>
          Credits remaining: <strong style={{color:'#a855f7'}}>{credits}</strong>
        </div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your website... e.g. A photography portfolio for a wedding photographer"
          style={{width:'100%',minHeight:'120px',padding:'12px',background:'#18181b',border:'1px solid #27272a',borderRadius:'8px',color:'white',fontSize:'14px',resize:'vertical',boxSizing:'border-box'}}
        />
        {error && <p style={{color:'#f87171',fontSize:'14px',margin:0}}>{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || credits === 0}
          style={{padding:'12px',background: isGenerating ? '#4c1d95' : '#7c3aed',color:'white',border:'none',borderRadius:'8px',fontSize:'16px',cursor: isGenerating ? 'not-allowed' : 'pointer'}}
        >
          {isGenerating ? 'Generating...' : 'Generate Website ✨'}
        </button>
        <div style={{fontSize:'13px',color:'#71717a'}}>
          <p style={{margin:'0 0 8px 0'}}>Try these examples:</p>
          {['Photography portfolio', 'Restaurant landing page', 'SaaS startup homepage', 'Personal blog'].map(ex => (
            <div key={ex} onClick={() => setPrompt(ex)} style={{padding:'6px 10px',background:'#18181b',borderRadius:'6px',marginBottom:'6px',cursor:'pointer',fontSize:'12px'}}>
              {ex}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'12px 16px',borderBottom:'1px solid #27272a',fontSize:'14px',color:'#71717a'}}>
          Live Preview
        </div>
        {generatedHTML ? (
          <iframe
            srcDoc={generatedHTML}
            sandbox="allow-scripts allow-same-origin"
            style={{flex:1,border:'none',width:'100%'}}
            title="Generated Website"
          />
        ) : (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#71717a'}}>
            {isGenerating ? '🤖 AI is generating your website...' : 'Your generated website will appear here'}
          </div>
        )}
      </div>
    </div>
  )
}

const LandingPage = () => <div style={{color:'white',padding:'40px',background:'#09090b',minHeight:'100vh'}}><h1>🏠 Landing Page</h1></div>

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) return <div style={{color:'white',padding:'40px',background:'#09090b',minHeight:'100vh'}}>Loading...</div>
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" afterSignUpUrl="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App