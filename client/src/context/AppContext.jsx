import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { setAuthToken, getUserProfile, getProjects, generateWebsite, deleteProject as deleteProjectAPI } from '../lib/api'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const { getToken } = useAuth()
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
    await getAuthToken()
    const response = await getUserProfile()
    setUser(response.data)
    setCredits(response.data.credits)
    return response.data
  }, [getAuthToken])

  const fetchProjects = useCallback(async () => {
    await getAuthToken()
    const response = await getProjects()
    setProjects(response.data.projects)
    return response.data.projects
  }, [getAuthToken])

  const generate = useCallback(async (prompt) => {
    await getAuthToken()
    setIsLoading(true)
    try {
      const response = await generateWebsite(prompt)
      const { project, remainingCredits } = response.data
      setCredits(remainingCredits)
      setProjects(prev => [project, ...prev])
      return project
    } finally {
      setIsLoading(false)
    }
  }, [getAuthToken])

  const removeProject = useCallback(async (id) => {
    await getAuthToken()
    await deleteProjectAPI(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [getAuthToken])

  const updateCredits = useCallback((newCredits) => {
    setCredits(newCredits)
  }, [])

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