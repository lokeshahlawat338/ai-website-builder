import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getProject, refineProject, updateProject } from '../lib/api'

const ProjectPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getAuthToken, credits, updateCredits } = useApp()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [instruction, setInstruction] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    const load = async () => {
      await getAuthToken()
      const res = await getProject(id)
      setProject(res.data.project)
      setLoading(false)
    }
    load()
  }, [id])

  const handleRefine = async () => {
    if (!instruction.trim()) return
    setIsRefining(true)
    try {
      await getAuthToken()
      const res = await refineProject(id, instruction)
      setProject(res.data.project)
      updateCredits(res.data.remainingCredits)
      setChatHistory(prev => [...prev, instruction])
      setInstruction('')
    } catch (err) {
      alert(err.response?.data?.error || 'Refinement failed')
    } finally {
      setIsRefining(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([project.generatedCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.title}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div style={{color:'white',padding:'40px',background:'#09090b',minHeight:'100vh'}}>Loading...</div>

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#09090b',color:'white'}}>
      {/* Top bar */}
      <div style={{padding:'12px 24px',borderBottom:'1px solid #27272a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <button onClick={() => navigate('/dashboard')} style={{background:'none',border:'none',color:'#71717a',cursor:'pointer'}}>← Back</button>
          <h2 style={{margin:0,fontSize:'16px'}}>{project.title}</h2>
        </div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <span style={{color:'#a855f7',fontSize:'14px'}}>⚡ {credits} credits</span>
          <button onClick={handleDownload} style={{padding:'8px 16px',background:'#7c3aed',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>
            Download HTML
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left: Chat panel */}
        <div style={{width:'320px',borderRight:'1px solid #27272a',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'16px',borderBottom:'1px solid #27272a'}}>
            <p style={{margin:0,fontSize:'13px',color:'#71717a'}}>Original prompt:</p>
            <p style={{margin:'4px 0 0 0',fontSize:'13px'}}>{project.prompt}</p>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
            {chatHistory.length === 0 && (
              <p style={{color:'#52525b',fontSize:'13px',textAlign:'center',marginTop:'20px'}}>
                Refine your website by typing instructions below
              </p>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} style={{background:'#7c3aed',borderRadius:'8px',padding:'8px 12px',fontSize:'13px',alignSelf:'flex-end',maxWidth:'90%'}}>
                {msg}
              </div>
            ))}
          </div>
          <div style={{padding:'16px',borderTop:'1px solid #27272a'}}>
            <textarea
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              placeholder="e.g. Make the header blue, add a contact form..."
              style={{width:'100%',minHeight:'80px',padding:'8px',background:'#18181b',border:'1px solid #27272a',borderRadius:'6px',color:'white',fontSize:'13px',resize:'none',boxSizing:'border-box'}}
            />
            <button onClick={handleRefine} disabled={isRefining || credits === 0}
              style={{width:'100%',marginTop:'8px',padding:'10px',background:isRefining?'#4c1d95':'#7c3aed',color:'white',border:'none',borderRadius:'6px',cursor:isRefining?'not-allowed':'pointer',fontSize:'14px'}}>
              {isRefining ? 'Refining...' : '✨ Refine (1 credit)'}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div style={{flex:1}}>
          <iframe srcDoc={project.generatedCode} sandbox="allow-scripts allow-same-origin" style={{width:'100%',height:'100%',border:'none'}} title="Preview" />
        </div>
      </div>
    </div>
  )
}
export default ProjectPage