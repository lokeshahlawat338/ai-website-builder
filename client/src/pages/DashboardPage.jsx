import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const DashboardPage = () => {
  const { projects, fetchUser, fetchProjects, removeProject, credits } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
    fetchProjects()
  }, [])

  return (
    <div style={{color:'white',padding:'40px',background:'#09090b',minHeight:'100vh'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
        <h1 style={{margin:0}}>My Projects</h1>
        <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
          <span style={{color:'#a855f7'}}>⚡ {credits} credits</span>
          <button onClick={() => navigate('/builder')} style={{padding:'10px 20px',background:'#7c3aed',color:'white',border:'none',borderRadius:'8px',cursor:'pointer'}}>
            + New Project
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div style={{textAlign:'center',marginTop:'80px',color:'#71717a'}}>
          <p style={{fontSize:'18px'}}>No projects yet</p>
          <button onClick={() => navigate('/builder')} style={{padding:'12px 24px',background:'#7c3aed',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',marginTop:'16px'}}>
            Build your first website
          </button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:'16px'}}>
          {projects.map(project => (
            <div key={project.id} style={{background:'#18181b',borderRadius:'12px',padding:'20px',border:'1px solid #27272a'}}>
              <h3 style={{margin:'0 0 8px 0',fontSize:'16px'}}>{project.title}</h3>
              <p style={{color:'#71717a',fontSize:'13px',margin:'0 0 16px 0'}}>{project.prompt?.slice(0, 80)}...</p>
              <p style={{color:'#52525b',fontSize:'12px',margin:'0 0 16px 0'}}>{new Date(project.createdAt).toLocaleDateString()}</p>
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={() => navigate(`/project/${project.id}`)} style={{flex:1,padding:'8px',background:'#7c3aed',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>
                  Open
                </button>
                <button onClick={() => removeProject(project.id)} style={{padding:'8px 12px',background:'#27272a',color:'#f87171',border:'none',borderRadius:'6px',cursor:'pointer'}}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default DashboardPage