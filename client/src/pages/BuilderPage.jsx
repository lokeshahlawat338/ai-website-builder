import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import { Zap, Sparkles, Monitor, Tablet, Smartphone, ExternalLink, Download, RefreshCw, Copy, Check } from 'lucide-react'

const EXAMPLE_PROMPTS = [
  { label: "📸 Photography Portfolio", prompt: "A photography portfolio for a wedding photographer with dark elegant theme, gallery section, about me, and contact form" },
  { label: "🍕 Restaurant Landing", prompt: "A modern restaurant landing page with menu, online reservations, location map and customer reviews" },
  { label: "🚀 SaaS Homepage", prompt: "A SaaS startup homepage with animated hero, features grid, pricing table, testimonials and newsletter signup" },
  { label: "✍️ Personal Blog", prompt: "A personal blog with dark theme, featured posts, categories sidebar and newsletter signup" },
  { label: "💪 Fitness Coach", prompt: "A fitness coach website with services, transformation gallery, testimonials and booking form" },
  { label: "⚖️ Law Firm", prompt: "A professional law firm landing page with practice areas, attorney profiles and consultation booking" },
]

const BuilderPage = () => {
  const { generate, isLoading, credits } = useApp()
  const [prompt, setPrompt] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [error, setError] = useState('')
  const [device, setDevice] = useState('desktop')
  const [copied, setCopied] = useState(false)
  const [activeExample, setActiveExample] = useState(null)
  const navigate = useNavigate()

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 10) return
    setError('')
    try {
      const project = await generate(prompt)
      setGeneratedHTML(project.generatedCode)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.')
    }
  }

  const handleExampleClick = (ex, i) => {
    setPrompt(ex.prompt)
    setActiveExample(i)
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

  const handleCopy = async () => {
    if (!generatedHTML) return
    await navigator.clipboard.writeText(generatedHTML)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleGenerate()
  }

  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' }
  const canGenerate = !isLoading && credits > 0 && prompt.trim().length >= 10

  return (
    <div style={{ height: '100vh', background: '#09090b', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', marginTop: '64px' }}>

        {/* LEFT PANEL */}
        <div style={{
          width: '400px', minWidth: '400px',
          background: '#0d0d10',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{
                width: '30px', height: '30px',
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={16} fill="currentColor" style={{ color: '#a855f7' }} />
              </div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>AI Website Builder</h2>
            </div>
            <p style={{ color: '#52525b', fontSize: '12px', marginLeft: '40px' }}>
              Describe your website and AI generates it instantly
            </p>
          </div>

          {/* Credits bar */}
          <div style={{
            padding: '10px 24px',
            background: credits <= 3 ? 'rgba(127,29,29,0.2)' : 'rgba(124,58,237,0.07)',
            borderBottom: `1px solid ${credits <= 3 ? 'rgba(239,68,68,0.2)' : 'rgba(124,58,237,0.12)'}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: '#71717a', fontSize: '12px' }}>Credits remaining</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: credits <= 3 ? '#f87171' : '#a855f7', fontWeight: 700, fontSize: '13px' }}>
                ⚡ {credits}
              </span>
              {credits <= 5 && (
                <button
                  onClick={() => navigate('/pricing')}
                  style={{
                    padding: '2px 8px', borderRadius: '6px',
                    background: 'rgba(124,58,237,0.2)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    color: '#c4b5fd', fontSize: '10px', cursor: 'pointer',
                  }}
                >
                  Buy more
                </button>
              )}
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Textarea */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#d4d4d8', fontSize: '13px', fontWeight: 500 }}>
                  Describe your website
                </label>
                <span style={{ color: '#3f3f46', fontSize: '11px' }}>Ctrl+Enter to generate</span>
              </div>
              <textarea
                value={prompt}
                onChange={e => { setPrompt(e.target.value); setActiveExample(null) }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. A dark photography portfolio with fullscreen hero, masonry gallery, about section and contact form..."
                rows={6}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'rgba(24,24,27,0.8)',
                  border: `1px solid ${prompt.length >= 10 ? 'rgba(124,58,237,0.4)' : 'rgba(63,63,70,0.6)'}`,
                  borderRadius: '12px', color: '#fff', fontSize: '13px',
                  resize: 'none', outline: 'none', lineHeight: 1.6,
                  fontFamily: 'inherit', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)'}
                onBlur={e => e.currentTarget.style.borderColor = prompt.length >= 10 ? 'rgba(124,58,237,0.4)' : 'rgba(63,63,70,0.6)'}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ color: '#3f3f46', fontSize: '11px' }}>{prompt.length} characters</span>
                {prompt.length > 0 && prompt.length < 10 && (
                  <span style={{ color: '#f87171', fontSize: '11px' }}>Need at least 10 characters</span>
                )}
                {prompt.length >= 10 && (
                  <span style={{ color: '#22c55e', fontSize: '11px' }}>Ready to generate</span>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 14px', borderRadius: '10px',
                background: 'rgba(127,29,29,0.3)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}>
                <p style={{ color: '#fca5a5', fontSize: '13px' }}>{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              style={{
                width: '100%', padding: '14px',
                background: canGenerate ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(39,39,42,0.6)',
                color: canGenerate ? '#fff' : '#52525b',
                border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: 600,
                cursor: canGenerate ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: canGenerate ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Generating your website...
                </>
              ) : credits === 0 ? (
                'No credits — Buy more'
              ) : (
                <><Sparkles size={15} /> Generate Website</>
              )}
            </button>

            {/* Regenerate */}
            {generatedHTML && !isLoading && (
              <button
                onClick={handleGenerate}
                style={{
                  width: '100%', padding: '10px',
                  background: 'transparent', color: '#71717a',
                  border: '1px solid rgba(63,63,70,0.6)',
                  borderRadius: '10px', fontSize: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.borderColor = 'rgba(63,63,70,0.6)' }}
              >
                <RefreshCw size={13} /> Regenerate
              </button>
            )}

            {/* Example Prompts */}
            <div>
              <p style={{ color: '#52525b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Quick Start Examples
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(ex, i)}
                    style={{
                      textAlign: 'left', padding: '10px 12px',
                      background: activeExample === i ? 'rgba(124,58,237,0.12)' : 'rgba(24,24,27,0.8)',
                      border: `1px solid ${activeExample === i ? 'rgba(124,58,237,0.4)' : 'rgba(63,63,70,0.5)'}`,
                      borderRadius: '10px', color: activeExample === i ? '#c4b5fd' : '#a1a1aa',
                      fontSize: '13px', cursor: 'pointer',
                      transition: 'all 0.15s', fontWeight: activeExample === i ? 500 : 400,
                    }}
                    onMouseEnter={e => {
                      if (activeExample !== i) {
                        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
                        e.currentTarget.style.color = '#d4d4d8'
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeExample !== i) {
                        e.currentTarget.style.borderColor = 'rgba(63,63,70,0.5)'
                        e.currentTarget.style.color = '#a1a1aa'
                      }
                    }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{
            height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
            background: '#0d0d10',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(24,24,27,0.8)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(63,63,70,0.4)' }}>
              {[
                { id: 'desktop', icon: <Monitor size={13} />, label: 'Desktop' },
                { id: 'tablet', icon: <Tablet size={13} />, label: 'Tablet' },
                { id: 'mobile', icon: <Smartphone size={13} />, label: 'Mobile' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  style={{
                    padding: '5px 10px', borderRadius: '7px',
                    background: device === d.id ? '#7c3aed' : 'transparent',
                    color: device === d.id ? '#fff' : '#71717a',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', fontWeight: device === d.id ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {d.icon}
                  {device === d.id && <span>{d.label}</span>}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {generatedHTML ? (
                <>
                  <button
                    onClick={handleCopy}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '6px 12px', borderRadius: '8px',
                      background: copied ? 'rgba(34,197,94,0.15)' : 'transparent',
                      color: copied ? '#86efac' : '#71717a',
                      border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(63,63,70,0.6)'}`,
                      fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy HTML'}
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedHTML], { type: 'text/html' })
                      window.open(URL.createObjectURL(blob), '_blank')
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '6px 12px', borderRadius: '8px',
                      background: 'transparent', color: '#71717a',
                      border: '1px solid rgba(63,63,70,0.6)',
                      fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
                  >
                    <ExternalLink size={12} /> Open
                  </button>
                  <button
                    onClick={handleDownload}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '6px 14px', borderRadius: '8px',
                      background: '#7c3aed', color: '#fff',
                      border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
                  >
                    <Download size={12} /> Download
                  </button>
                </>
              ) : (
                <span style={{ color: '#3f3f46', fontSize: '12px' }}>Generate a website to see preview</span>
              )}
            </div>
          </div>

          {/* Preview Area */}
          <div style={{
            flex: 1, background: '#07070a',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            overflow: 'hidden',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '20px',
          }}>
            {generatedHTML ? (
              <div style={{
                height: '100%', background: '#fff',
                borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
                width: deviceWidths[device],
                transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <iframe
                  srcDoc={generatedHTML}
                  sandbox="allow-scripts allow-same-origin"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Generated Website Preview"
                />
              </div>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: '100%', width: '100%', textAlign: 'center',
              }}>
                {isLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        border: '2px solid rgba(124,58,237,0.15)',
                        borderTopColor: '#7c3aed', borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }} />
                      <div style={{
                        position: 'absolute', inset: '8px',
                        border: '2px solid rgba(168,85,247,0.15)',
                        borderTopColor: '#a855f7', borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite reverse',
                      }} />
                    </div>
                    <div>
                      <p style={{ color: '#d4d4d8', fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>
                        AI is building your website...
                      </p>
                      <p style={{ color: '#52525b', fontSize: '13px' }}>
                        Generating HTML, CSS and JavaScript
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '72px', height: '72px',
                      background: 'rgba(24,24,27,0.8)',
                      border: '1px solid rgba(63,63,70,0.5)',
                      borderRadius: '20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Monitor size={32} style={{ color: '#3f3f46' }} />
                    </div>
                    <div>
                      <p style={{ color: '#71717a', fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>
                        Your website will appear here
                      </p>
                      <p style={{ color: '#3f3f46', fontSize: '13px' }}>
                        Pick an example or describe your website on the left
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
export default BuilderPage