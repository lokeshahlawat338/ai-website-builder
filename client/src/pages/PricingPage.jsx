import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import { Zap, Check } from 'lucide-react'
import api from '../lib/api'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$4.99',
    credits: 10,
    description: 'Perfect for trying out the platform',
    features: [
      '10 AI website generations',
      'Live preview',
      'Download HTML',
      'Chat-style refinement',
      'Email support'
    ],
    popular: false,
    color: 'border-zinc-700'
  },
  {
    id: 'popular',
    name: 'Popular',
    price: '$14.99',
    credits: 50,
    description: 'Best value for regular builders',
    features: [
      '50 AI website generations',
      'Live preview',
      'Download HTML',
      'Chat-style refinement',
      'Priority support',
      'All website types'
    ],
    popular: true,
    color: 'border-purple-600'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$34.99',
    credits: 150,
    description: 'For power users and agencies',
    features: [
      '150 AI website generations',
      'Live preview',
      'Download HTML',
      'Chat-style refinement',
      'Priority support',
      'All website types',
      'Commercial license'
    ],
    popular: false,
    color: 'border-zinc-700'
  }
]

const PricingPage = () => {
  const { isSignedIn } = useAuth()
  const { getAuthToken } = useApp()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState(null)

  const handlePurchase = async (planId) => {
    if (!isSignedIn) {
      navigate('/sign-up')
      return
    }

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
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-zinc-400 text-lg">
            Start free with 5 credits. No credit card required.
          </p>

          {/* Free tier callout */}
          <div className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-purple-950 border border-purple-800 rounded-xl">
            <Zap size={16} className="text-purple-400" fill="currentColor" />
            <span className="text-purple-300 text-sm font-medium">
              Every new account gets 5 free credits on signup
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-zinc-900 border-2 ${plan.color} rounded-2xl p-6 flex flex-col`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-400 text-sm">one-time</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <Zap size={14} className="text-purple-400" fill="currentColor" />
                  <span className="text-purple-400 font-semibold">{plan.credits} credits</span>
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-purple-950 border border-purple-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-purple-400" />
                    </div>
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-3 font-semibold rounded-xl transition-all text-sm ${
                  plan.popular
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingPlan === plan.id ? 'Redirecting...' : `Get ${plan.credits} Credits`}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "What is a credit?",
                a: "One credit = one AI website generation or one refinement. Credits never expire."
              },
              {
                q: "Can I download the generated websites?",
                a: "Yes! Every generated website can be downloaded as a complete HTML file that you fully own."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards and UPI through Stripe's secure payment system."
              },
              {
                q: "Do credits expire?",
                a: "No. Credits never expire. Use them at your own pace."
              }
            ].map((faq, i) => (
              <div key={i} className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage