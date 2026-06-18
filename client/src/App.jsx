import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react'

// Placeholder pages — we will build these properly later
const LandingPage = () => <div style={{color:'white',padding:'40px',background:'#09090b',minHeight:'100vh'}}><h1>🏠 Landing Page</h1></div>
const DashboardPage = () => <div style={{color:'white',padding:'40px',background:'#09090b',minHeight:'100vh'}}><h1>📊 Dashboard</h1></div>
const BuilderPage = () => <div style={{color:'white',padding:'40px',background:'#09090b',minHeight:'100vh'}}><h1>⚡ Builder</h1></div>

// Protected route wrapper
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
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" afterSignUpUrl="/dashboard" />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App