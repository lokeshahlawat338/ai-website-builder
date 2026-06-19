import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const BuilderPage = () => {
  const { generate, isLoading, credits } = useApp()
  const [prompt, setPrompt] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setError('')
    try {
      const project = await generate(prompt)
      setGeneratedHTML(project.generatedCode)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed')
    }
  }

  return (
    <div style={{display:'flex',height:'100vh',background:'#09090b',color:'white'}}>
      <div style={{width:'400px',padding:'24px',borderRight:'1px solid #27272a',display:'flex',flexDirection:'column',gap:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0,color:'#a855f7'}}>⚡ AI Builder</h2>
          <button onClick={() => navigate('/dashboard')} style={{background:'none',border:'none',color:'#71717a',cursor:'pointer'}}>
            ← Dashboard
          </button>
        </div>
        <div style={{padding:'8px 12px',background:'#18181b',borderRadius:'8px',fontSize:'14px'}}>
          Credits: <strong style={{color:'#a855f7'}}>{credits}</strong>
        </div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your website..."
          style={{width:'100%',minHeight:'120px',padding:'12px',background:'#18181b',border:'1px solid #27272a',borderRadius:'8px',color:'white',fontSize:'14px',resize:'vertical',boxSizing:'border-box'}}
        />
        {error && <p style={{color:'#f87171',fontSize:'14px',margin:0}}>{error}</p>}
        <button onClick={handleGenerate} disabled={isLoading || credits === 0}
          style={{padding:'12px',background:isLoading?'#4c1d95':'#7c3aed',color:'white',border:'none',borderRadius:'8px',fontSize:'16px',cursor:isLoading?'not-allowed':'pointer'}}>
          {isLoading ? 'Generating...' : 'Generate Website ✨'}
        </button>
        <div style={{fontSize:'13px',color:'#71717a'}}>
          {['Photography portfolio','Restaurant landing page','SaaS startup homepage','Personal blog'].map(ex => (
            <div key={ex} onClick={() => setPrompt(ex)} style={{padding:'6px 10px',background:'#18181b',borderRadius:'6px',marginBottom:'6px',cursor:'pointer',fontSize:'12px'}}>
              {ex}
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'12px 16px',borderBottom:'1px solid #27272a',fontSize:'14px',color:'#71717a'}}>
          Live Preview
        </div>
        {generatedHTML ? (
          <iframe srcDoc={generatedHTML} sandbox="allow-scripts allow-same-origin" style={{flex:1,border:'none',width:'100%'}} title="Preview" />
        ) : (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#71717a'}}>
            {isLoading ? '🤖 Generating your website...' : 'Your website will appear here'}
          </div>
        )}
      </div>
    </div>
  )
}
export default BuilderPage