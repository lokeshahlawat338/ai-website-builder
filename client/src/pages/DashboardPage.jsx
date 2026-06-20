import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import { Plus, Trash2, ExternalLink, Clock, Zap } from 'lucide-react'

const DashboardPage = () => {
  const { projects, fetchUser, fetchProjects, removeProject, credits } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const init = async () => {
      await fetchUser()
      await fetchProjects()
    }
    init()
    if (searchParams.get('payment') === 'success') {
      toast.success('Payment successful! Credits will be added shortly.')
    }
    if (searchParams.get('payment') === 'cancelled') {
      toast.error('Payment cancelled.')
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#09090b' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '8px' }}>
              My Projects
            </h1>
            <p style={{ color: '#71717a', fontSize: '15px' }}>
              Manage, preview and refine your AI-generated websites
            </p>
          </div>
          <button
            onClick={() => navigate('/builder')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              background: '#7c3aed', color: '#fff',
              border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
            onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
          >
            <Plus size={17} />
            New Project
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Projects', value: projects.length, color: '#fff' },
            { label: 'Credits Available', value: credits, color: '#a855f7' },
            { label: 'Status', value: projects.length > 0 ? 'Active' : 'No Projects', color: '#22c55e' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '24px',
              background: 'rgba(24,24,27,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              backdropFilter: 'blur(16px)',
            }}>
              <p style={{ color: '#71717a', fontSize: '13px', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Projects */}
        {projects.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 24px', textAlign: 'center',
          }}>
            <div style={{
              width: '72px', height: '72px',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '24px',
            }}>
              <Plus size={32} style={{ color: '#a855f7' }} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>No projects yet</h3>
            <p style={{ color: '#71717a', marginBottom: '32px', maxWidth: '360px', lineHeight: 1.6 }}>
              Create your first AI-generated website and start building beautiful experiences in seconds.
            </p>
            <button
              onClick={() => navigate('/builder')}
              style={{
                padding: '12px 28px', borderRadius: '12px',
                background: '#7c3aed', color: '#fff',
                border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Build Your First Website
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {projects.map(project => (
              <div
                key={project.id}
                style={{
                  background: 'rgba(24,24,27,0.7)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backdropFilter: 'blur(16px)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Preview area */}
                <div style={{
                  height: '140px',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(168,85,247,0.05), rgba(24,24,27,1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{
                    width: '56px', height: '56px',
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(124,58,237,0.2)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ExternalLink size={24} style={{ color: '#a855f7' }} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    color: '#fff', fontWeight: 600, fontSize: '15px',
                    marginBottom: '8px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {project.title}
                  </h3>
                  <p style={{
                    color: '#71717a', fontSize: '13px', lineHeight: 1.6,
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {project.prompt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#52525b', fontSize: '12px', marginBottom: '16px' }}>
                    <Clock size={12} />
                    {new Date(project.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/project/${project.id}`)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '10px', borderRadius: '10px',
                        background: '#7c3aed', color: '#fff',
                        border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
                      onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
                    >
                      <ExternalLink size={13} /> Open
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this project?')) removeProject(project.id)
                      }}
                      style={{
                        padding: '10px 12px', borderRadius: '10px',
                        background: 'rgba(39,39,42,0.8)', color: '#71717a',
                        border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(127,29,29,0.3)'
                        e.currentTarget.style.color = '#f87171'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(39,39,42,0.8)'
                        e.currentTarget.style.color = '#71717a'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage