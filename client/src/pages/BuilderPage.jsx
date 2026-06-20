import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import { Zap, Sparkles, Monitor, Tablet, Smartphone, ExternalLink, Download } from 'lucide-react'

const EXAMPLE_PROMPTS = [
  "A photography portfolio for a wedding photographer with gallery and contact form",
  "A modern restaurant landing page with menu, reservations and location",
  "A SaaS startup homepage with hero, features, pricing and testimonials",
  "A personal blog with dark theme, featured posts and newsletter signup",
  "A fitness coach website with services, testimonials and booking form",
  "A law firm landing page with practice areas and attorney profiles"
]

const BuilderPage = () => {
  const { generate, isLoading, credits } = useApp()
  const [prompt, setPrompt] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [error, setError] = useState('')
  const [device, setDevice] = useState('desktop')
  const navigate = useNavigate()

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setError('')
    try {
      const project = await generate(prompt)
      setGeneratedHTML(project.generatedCode)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.')
    }
  }

  const handleDownload = () => {
    if (!generatedHTML) return
    const blob = new Blob([generatedHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'website.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' }

  return (
    <div style={{ height: '100vh', background: '#09090b', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', marginTop: '64px' }}>

        {/* Left Panel */}
        <div style={{
          width: '380px', minWidth: '380px',
          background: 'rgba(18,18,20,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Zap size={20} fill="currentColor" style={{ color: '#a855f7' }} />
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>AI Website Builder</h2>
            </div>
            <p style={{ color: '#52525b', fontSize: '13px' }}>Describe your website and let AI do the work</p>
          </div>

          {/* Credits bar */}
          <div style={{
            padding: '10px 24px',
            background: 'rgba(124,58,237,0.08)',
            borderBottom: '1px solid rgba(124,58,237,0.15)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: '#71717a', fontSize: '13px' }}>Credits remaining</span>
            <span style={{ color: credits <= 3 ? '#f87171' : '#a855f7', fontWeight: 700, fontSize: '13px' }}>⚡ {credits}</span>
          </div>

          {/* Scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={{ color: '#d4d4d8', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                Describe your website
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. A photography portfolio with dark elegant theme, gallery, about me, and contact form..."
                style={{
                  width: '100%', minHeight: '130px', padding: '12px 14px',
                  background: 'rgba(39,39,42,0.6)',
                  border: '1px solid rgba(63,63,70,0.8)',
                  borderRadius: '12px', color: '#fff', fontSize: '13px',
                  resize: 'vertical', outline: 'none', lineHeight: 1.6,
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(63,63,70,0.8)'}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ color: '#52525b', fontSize: '11px' }}>{prompt.length} chars</span>
                {prompt.length < 10 && prompt.length > 0 && (
                  <span style={{ color: '#f87171', fontSize: '11px' }}>Too short</span>
                )}
              </div>
            </div>

            {error && (
              <div style={{
                padding: '12px', borderRadius: '10px',
                background: 'rgba(127,29,29,0.3)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}>
                <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading || credits === 0 || prompt.trim().length < 10}
              style={{
                width: '100%', padding: '13px',
                background: isLoading || credits === 0 || prompt.trim().length < 10 ? '#27272a' : '#7c3aed',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Generating...
                </>
              ) : (
                <><Sparkles size={15} /> Generate Website ✨</>
              )}
            </button>

            {credits === 0 && (
              <button
                onClick={() => navigate('/pricing')}
                style={{
                  width: '100%', padding: '12px',
                  background: 'transparent', color: '#a855f7',
                  border: '1px solid rgba(124,58,237,0.4)',
                  borderRadius: '12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                }}
              >
                Buy more credits →
              </button>
            )}

            {/* Examples */}
            <div>
              <p style={{ color: '#52525b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Try these examples
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    style={{
                      textAlign: 'left', padding: '10px 12px',
                      background: 'rgba(39,39,42,0.5)',
                      border: '1px solid rgba(63,63,70,0.6)',
                      borderRadius: '10px', color: '#a1a1aa', fontSize: '12px',
                      cursor: 'pointer', lineHeight: 1.5,
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(63,63,70,0.6)'}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{
            height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
            background: 'rgba(18,18,20,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[
                { id: 'desktop', icon: <Monitor size={14} /> },
                { id: 'tablet', icon: <Tablet size={14} /> },
                { id: 'mobile', icon: <Smartphone size={14} /> },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  style={{
                    padding: '6px 10px', borderRadius: '8px',
                    background: device === d.id ? '#7c3aed' : 'transparent',
                    color: device === d.id ? '#fff' : '#71717a',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  }}
                >
                  {d.icon}
                </button>
              ))}
              <span style={{ color: '#52525b', fontSize: '11px', marginLeft: '8px' }}>
                {device === 'desktop' ? 'Full width' : device === 'tablet' ? '768px' : '375px'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {generatedHTML && (
                <>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedHTML], { type: 'text/html' })
                      window.open(URL.createObjectURL(blob), '_blank')
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '8px',
                      background: 'transparent', color: '#a1a1aa',
                      border: '1px solid rgba(63,63,70,0.8)', fontSize: '12px', cursor: 'pointer',
                    }}
                  >
                    <ExternalLink size={12} /> Open
                  </button>
                  <button
                    onClick={handleDownload}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '8px',
                      background: '#7c3aed', color: '#fff',
                      border: 'none', fontSize: '12px', cursor: 'pointer',
                    }}
                  >
                    <Download size={12} /> Download
                  </button>
                </>
              )}
              <span style={{ color: '#3f3f46', fontSize: '11px' }}>Live Preview</span>
            </div>
          </div>

          {/* Preview */}
          <div style={{
            flex: 1, background: '#09090b', overflow: 'hidden',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '16px',
          }}>
            {generatedHTML ? (
              <div style={{
                height: '100%', background: '#fff',
                borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                width: deviceWidths[device],
                transition: 'width 0.3s ease',
              }}>
                <iframe
                  srcDoc={generatedHTML}
                  sandbox="allow-scripts allow-same-origin"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Preview"
                />
              </div>
            ) : (
              <div style={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {isLoading ? (
                  <>
                    <div style={{
                      width: '44px', height: '44px',
                      border: '2px solid rgba(124,58,237,0.2)',
                      borderTopColor: '#7c3aed',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      marginBottom: '16px',
                    }} />
                    <p style={{ color: '#a1a1aa', fontSize: '14px' }}>AI is crafting your website...</p>
                    <p style={{ color: '#52525b', fontSize: '12px', marginTop: '4px' }}>This usually takes 5–10 seconds</p>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '56px', height: '56px',
                      background: 'rgba(39,39,42,0.6)',
                      border: '1px solid rgba(63,63,70,0.6)',
                      borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '16px',
                    }}>
                      <Monitor size={24} style={{ color: '#52525b' }} />
                    </div>
                    <p style={{ color: '#71717a', fontSize: '14px', fontWeight: 500 }}>Your website preview will appear here</p>
                    <p style={{ color: '#3f3f46', fontSize: '12px', marginTop: '4px' }}>Describe your website and click Generate</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderPage