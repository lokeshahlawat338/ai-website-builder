import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import { Zap, Check, ArrowRight } from 'lucide-react'
import api from '../lib/api'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$4.99',
    credits: 10,
    description: 'Perfect for trying out',
    features: ['10 AI generations', 'Live preview', 'Download HTML', 'Chat refinement', 'Email support'],
    popular: false,
  },
  {
    id: 'popular',
    name: 'Popular',
    price: '$14.99',
    credits: 50,
    description: 'Best value for builders',
    features: ['50 AI generations', 'Live preview', 'Download HTML', 'Chat refinement', 'Priority support', 'All website types'],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$34.99',
    credits: 150,
    description: 'For power users & agencies',
    features: ['150 AI generations', 'Live preview', 'Download HTML', 'Chat refinement', 'Priority support', 'All types', 'Commercial license'],
    popular: false,
  }
]

const PricingPage = () => {
  const { isSignedIn } = useAuth()
  const { getAuthToken } = useApp()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState(null)

  const handlePurchase = async (planId) => {
    if (!isSignedIn) { navigate('/sign-up'); return }
    setLoadingPlan(planId)
    try {
      await getAuthToken()
      const response = await api.post('/api/v1/payment/checkout', { packageId: planId })
      window.location.href = response.data.url
    } catch (error) {
      toast.error('Failed to start checkout. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b' }}>
      <Navbar />

      {/* Gradient */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at top center, rgba(124,58,237,0.08) 0%, transparent 60%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '120px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
            color: '#c4b5fd', fontSize: '13px', fontWeight: 500,
            marginBottom: '24px',
          }}>
            <Zap size={13} fill="currentColor" />
            Flexible credit-based pricing
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800, letterSpacing: '-1px',
            color: '#fff', marginBottom: '16px', lineHeight: 1.1,
          }}>
            Simple pricing for
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #c084fc, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              AI Website Generation
            </span>
          </h1>

          <p style={{ color: '#71717a', fontSize: '17px', maxWidth: '480px', margin: '0 auto' }}>
            Start free and scale as you build more websites. Credits never expire.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              style={{
                position: 'relative',
                padding: '32px',
                borderRadius: '24px',
                background: plan.popular ? 'rgba(30,20,50,0.9)' : 'rgba(18,18,20,0.9)',
                border: plan.popular ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: plan.popular ? '0 0 60px rgba(124,58,237,0.15)' : 'none',
                transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  padding: '4px 16px', borderRadius: '999px',
                  background: '#7c3aed', color: '#fff',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>
                  MOST POPULAR
                </div>
              )}

              <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>{plan.name}</h3>
              <p style={{ color: '#71717a', fontSize: '13px', marginBottom: '24px' }}>{plan.description}</p>

              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>{plan.price}</span>
                <span style={{ color: '#52525b', fontSize: '14px', marginLeft: '6px' }}>one-time</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
                <Zap size={15} fill="currentColor" style={{ color: '#a855f7' }} />
                <span style={{ color: '#a855f7', fontWeight: 600, fontSize: '15px' }}>{plan.credits} Credits</span>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: 'rgba(124,58,237,0.15)',
                      border: '1px solid rgba(124,58,237,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Check size={11} style={{ color: '#a855f7' }} />
                    </div>
                    <span style={{ color: '#d4d4d8', fontSize: '14px' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={loadingPlan === plan.id}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: '14px',
                  background: plan.popular ? '#7c3aed' : 'rgba(39,39,42,0.8)',
                  color: '#fff', border: plan.popular ? 'none' : '1px solid rgba(63,63,70,0.8)',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  opacity: loadingPlan === plan.id ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!loadingPlan) e.currentTarget.style.background = plan.popular ? '#6d28d9' : 'rgba(63,63,70,0.8)' }}
                onMouseLeave={e => { e.currentTarget.style.background = plan.popular ? '#7c3aed' : 'rgba(39,39,42,0.8)' }}
              >
                {loadingPlan === plan.id ? 'Redirecting...' : `Get ${plan.credits} Credits`}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '40px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              ['What is a credit?', 'One credit equals one AI website generation or one refinement. Use them anytime.'],
              ['Can I download websites?', 'Yes! Every generated website can be downloaded as a complete HTML file that you fully own.'],
              ['Do credits expire?', 'Never. Credits stay in your account until you use them.'],
              ['What payment methods?', 'All major credit/debit cards accepted through Stripe\'s secure payment system.'],
            ].map(([q, a], i) => (
              <div key={i} style={{
                padding: '24px',
                background: 'rgba(18,18,20,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
              }}>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>{q}</h3>
                <p style={{ color: '#71717a', fontSize: '13px', lineHeight: 1.6 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center', padding: '64px 40px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(168,85,247,0.05))',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            Ready to build with AI?
          </h2>
          <p style={{ color: '#71717a', fontSize: '16px', marginBottom: '32px' }}>
            Start generating beautiful websites today.
          </p>
          <button
            onClick={() => navigate(isSignedIn ? '/builder' : '/sign-up')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', borderRadius: '12px',
              background: '#7c3aed', color: '#fff',
              border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
            onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
          >
            Start Building Free <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingPage