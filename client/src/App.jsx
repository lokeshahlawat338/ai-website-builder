import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import BuilderPage from './pages/BuilderPage'
import ProjectPage from './pages/ProjectPage'
import PricingPage from './pages/PricingPage'

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) return <div style={{color:'white',padding:'40px',background:'#09090b',minHeight:'100vh'}}>Loading...</div>
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" afterSignUpUrl="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App