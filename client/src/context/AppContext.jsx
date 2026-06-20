import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { setAuthToken, getUserProfile, getProjects, generateWebsite, deleteProject as deleteProjectAPI } from '../lib/api'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const { getToken, isSignedIn, isLoaded } = useAuth()
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(0)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getAuthToken = useCallback(async () => {
    const token = await getToken()
    setAuthToken(token)
    return token
  }, [getToken])

  const fetchUser = useCallback(async () => {
    try {
      const token = await getToken()
      if (!token) return
      setAuthToken(token)
      const response = await getUserProfile()
      setUser(response.data)
      setCredits(response.data.credits)
      return response.data
    } catch (error) {
      console.error('fetchUser error:', error)
    }
  }, [getToken])

  const fetchProjects = useCallback(async () => {
    try {
      await getAuthToken()
      const response = await getProjects()
      setProjects(response.data.projects)
      return response.data.projects
    } catch (error) {
      console.error('fetchProjects error:', error)
    }
  }, [getAuthToken])

  const generate = useCallback(async (prompt) => {
    await getAuthToken()
    setIsLoading(true)
    try {
      const response = await generateWebsite(prompt)
      const { project, remainingCredits } = response.data
      setCredits(remainingCredits)
      setProjects(prev => [project, ...prev])
      toast.success('Website generated successfully!')
      return project
    } catch (error) {
      const message = error.response?.data?.error || 'Generation failed'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [getAuthToken])

  const removeProject = useCallback(async (id) => {
    try {
      await getAuthToken()
      await deleteProjectAPI(id)
      setProjects(prev => prev.filter(p => p.id !== id))
      toast.success('Project deleted')
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }, [getAuthToken])

  const updateCredits = useCallback((newCredits) => {
    setCredits(newCredits)
  }, [])

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUser()
    }
  }, [isLoaded, isSignedIn])

  return (
    <AppContext.Provider value={{
      user,
      credits,
      projects,
      isLoading,
      fetchUser,
      fetchProjects,
      generate,
      removeProject,
      updateCredits,
      getAuthToken
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}