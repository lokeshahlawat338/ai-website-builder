import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getProject, refineProject } from '../lib/api'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Download, ExternalLink, Monitor, Tablet,
  Smartphone, Send, Zap, Copy, RotateCcw
} from 'lucide-react'

const ProjectPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getAuthToken, credits, updateCredits } = useApp()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [instruction, setInstruction] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [device, setDevice] = useState('desktop')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        await getAuthToken()
        const res = await getProject(id)
        setProject(res.data.project)
        // Load existing prompt history as chat
        if (res.data.project.promptHistory?.length > 1) {
          setChatHistory(res.data.project.promptHistory.slice(1))
        }
      } catch (err) {
        toast.error('Failed to load project')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleRefine = async () => {
    if (!instruction.trim()) return
    if (credits <= 0) {
      toast.error('No credits remaining. Please purchase more.')
      navigate('/pricing')
      return
    }

    const currentInstruction = instruction
    setInstruction('')
    setIsRefining(true)

    // Optimistically add to chat
    setChatHistory(prev => [...prev, currentInstruction])

    try {
      await getAuthToken()
      const res = await refineProject(id, currentInstruction)
      setProject(res.data.project)
      updateCredits(res.data.remainingCredits)
      toast.success('Website refined successfully!')
    } catch (err) {
      // Remove optimistic message on failure
      setChatHistory(prev => prev.slice(0, -1))
      setInstruction(currentInstruction)
      toast.error(err.response?.data?.error || 'Refinement failed')
    } finally {
      setIsRefining(false)
    }
  }

  const handleDownload = () => {
    if (!project) return
    const blob = new Blob([project.generatedCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.title.replace(/[^a-z0-9]/gi, '-')}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  const handleOpenNewTab = () => {
    if (!project) return
    const blob = new Blob([project.generatedCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  const handleCopyCode = async () => {
    if (!project) return
    await navigator.clipboard.writeText(project.generatedCode)
    setCopied(true)
    toast.success('HTML copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRefine()
    }
  }

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  }

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="w-px h-4 bg-zinc-700" />
          <h1 className="text-white font-medium text-sm truncate max-w-xs">
            {project?.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-950 border border-purple-800 rounded-lg">
            <Zap size={12} className="text-purple-400" fill="currentColor" />
            <span className="text-purple-300 text-xs font-medium">{credits}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-white text-xs border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
          >
            <Copy size={13} />
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
          <button
            onClick={handleOpenNewTab}
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat Panel */}
        <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0">
          {/* Original Prompt */}
          <div className="p-4 border-b border-zinc-800">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">
              Original Prompt
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {project?.prompt}
            </p>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center mb-3">
                  <RotateCcw size={18} className="text-zinc-500" />
                </div>
                <p className="text-zinc-500 text-sm font-medium mb-1">
                  Refine your website
                </p>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  Type an instruction below to modify your website using AI
                </p>
                <div className="mt-4 flex flex-col gap-2 w-full">
                  {[
                    'Make the header dark blue',
                    'Add a contact form section',
                    'Change colors to red theme',
                    'Make it more minimalist'
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInstruction(suggestion)}
                      className="text-left px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-400 text-xs transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((msg, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-purple-600 text-white text-sm px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed">
                        {msg}
                      </div>
                    </div>
                    {/* AI response */}
                    <div className="flex justify-start">
                      <div className="bg-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed flex items-center gap-1.5">
                        <Zap size={10} className="text-purple-400 flex-shrink-0" fill="currentColor" />
                        Website updated ✓
                      </div>
                    </div>
                  </div>
                ))}
                {isRefining && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 text-zinc-400 text-xs px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-2">
                      <div className="w-3 h-3 border border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                      Refining website...
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex flex-col gap-2">
              <textarea
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Make the hero section taller, change colors to blue..."
                disabled={isRefining}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:outline-none rounded-xl text-white text-sm placeholder-zinc-500 resize-none transition-colors disabled:opacity-50"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 text-xs">
                  Press Enter to send • Shift+Enter for new line
                </span>
                <button
                  onClick={handleRefine}
                  disabled={isRefining || !instruction.trim() || credits <= 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {isRefining ? (
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={12} />
                  )}
                  Refine (1 credit)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview toolbar */}
          <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              {[
                { id: 'desktop', icon: <Monitor size={14} />, label: 'Desktop' },
                { id: 'tablet', icon: <Tablet size={14} />, label: 'Tablet' },
                { id: 'mobile', icon: <Smartphone size={14} />, label: 'Mobile' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    device === d.id
                      ? 'bg-purple-600 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {d.icon}
                  <span className="hidden sm:inline">{d.label}</span>
                </button>
              ))}
            </div>
            <span className="text-zinc-600 text-xs">
              {device === 'desktop' ? 'Full width' : device === 'tablet' ? '768px' : '375px'}
            </span>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-zinc-950 overflow-hidden flex items-start justify-center p-3">
            {isRefining ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                  <p className="text-zinc-400 text-sm">AI is refining your website...</p>
                </div>
              </div>
            ) : (
              <div
                className="h-full bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
                style={{ width: deviceWidths[device] }}
              >
                <iframe
                  srcDoc={project?.generatedCode}
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-none"
                  title="Website Preview"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage