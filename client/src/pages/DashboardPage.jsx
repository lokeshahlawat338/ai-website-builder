import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import { Plus, Trash2, ExternalLink, Clock } from 'lucide-react'

const DashboardPage = () => {
  const { projects, fetchUser, fetchProjects, removeProject, credits } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      await fetchUser()
      await fetchProjects()
    }
    init()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="text-zinc-400 mt-1">Manage and view your generated websites</p>
          </div>
          <button
            onClick={() => navigate('/builder')}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <Plus size={28} className="text-zinc-600" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">No projects yet</h3>
            <p className="text-zinc-400 mb-6">Build your first AI-generated website</p>
            <button
              onClick={() => navigate('/builder')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
            >
              Build your first website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-purple-800 transition-all group"
              >
                {/* Project title */}
                <h3 className="text-white font-semibold text-base mb-2 line-clamp-1">
                  {project.title}
                </h3>

                {/* Prompt preview */}
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {project.prompt}
                </p>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-4">
                  <Clock size={12} />
                  {new Date(project.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                    Open
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this project?')) {
                        removeProject(project.id)
                      }
                    }}
                    className="p-2 bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
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