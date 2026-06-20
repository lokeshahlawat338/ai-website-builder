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

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  }

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Left Panel */}
        <div className="w-96 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Zap size={20} className="text-purple-400" fill="currentColor" />
              AI Website Builder
            </h2>
            <p className="text-zinc-400 text-sm mt-1">Describe your website and let AI do the work</p>
          </div>

          {/* Credits */}
          <div className="px-6 py-3 bg-purple-950/40 border-b border-purple-900/30 flex items-center justify-between">
            <span className="text-zinc-400 text-sm">Credits remaining</span>
            <span className={`font-bold text-sm ${credits <= 3 ? 'text-red-400' : 'text-purple-400'}`}>
              ⚡ {credits}
            </span>
          </div>

          {/* Prompt Input */}
          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4">
            <div>
              <label className="text-zinc-300 text-sm font-medium mb-2 block">
                Describe your website
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. A photography portfolio for a wedding photographer with a dark elegant theme, gallery section, about me, and contact form..."
                className="w-full h-36 px-4 py-3 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-purple-500 focus:outline-none rounded-xl text-white text-sm placeholder-zinc-500 resize-none transition-colors"
              />
              <div className="flex justify-between mt-1">
                <span className="text-zinc-600 text-xs">{prompt.length} characters</span>
                {prompt.length < 10 && prompt.length > 0 && (
                  <span className="text-red-400 text-xs">Too short</span>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading || credits === 0 || prompt.trim().length < 10}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating your website...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Website ✨
                </>
              )}
            </button>

            {credits === 0 && (
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-3 border border-purple-700 text-purple-400 hover:bg-purple-950 rounded-xl text-sm font-medium transition-colors"
              >
                Buy more credits →
              </button>
            )}

            {/* Example Prompts */}
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">
                Try these examples
              </p>
              <div className="flex flex-col gap-2">
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    className="text-left px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg text-zinc-300 text-xs transition-colors leading-relaxed"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview Toolbar */}
          <div className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-1">
              {[
                { id: 'desktop', icon: <Monitor size={15} /> },
                { id: 'tablet', icon: <Tablet size={15} /> },
                { id: 'mobile', icon: <Smartphone size={15} /> }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`p-2 rounded-lg transition-colors ${device === d.id ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                >
                  {d.icon}
                </button>
              ))}
              <span className="text-zinc-500 text-xs ml-2">
                {device === 'desktop' ? 'Full width' : device === 'tablet' ? '768px' : '375px'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {generatedHTML && (
                <>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedHTML], { type: 'text/html' })
                      window.open(URL.createObjectURL(blob), '_blank')
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-white text-xs border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
                  >
                    <ExternalLink size={13} />
                    Open
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
                  >
                    <Download size={13} />
                    Download
                  </button>
                </>
              )}
              <span className="text-zinc-600 text-xs">Live Preview</span>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-zinc-950 overflow-hidden flex items-start justify-center p-4">
            {generatedHTML ? (
              <div
                className="h-full bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
                style={{ width: deviceWidths[device] }}
              >
                <iframe
                  srcDoc={generatedHTML}
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-none"
                  title="Generated Website Preview"
                />
              </div>
            ) : (
              <div className="flex-1 w-full h-full flex flex-col items-center justify-center text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                    <p className="text-zinc-400 text-sm">AI is crafting your website...</p>
                    <p className="text-zinc-600 text-xs">This usually takes 5-10 seconds</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
                      <Monitor size={28} className="text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 font-medium">Your website preview will appear here</p>
                    <p className="text-zinc-600 text-sm">Describe your website and click Generate</p>
                  </div>
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