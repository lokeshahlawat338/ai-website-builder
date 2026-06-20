import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Navbar from '../components/Navbar'
import { Zap, Globe, Download, ArrowRight } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const handleStart = () => {
    if (isSignedIn) {
      navigate('/builder')
    } else {
      navigate('/sign-up')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-950 border border-purple-800 rounded-full text-purple-300 text-sm mb-8">
            <Zap size={14} fill="currentColor" />
            Powered by LLaMA AI — Free to get started
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build any website in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              seconds with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Describe your idea. Our AI generates a complete, beautiful website instantly. 
            No coding required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-lg transition-all hover:scale-105"
            >
              Start Building Free
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold rounded-xl text-lg transition-colors"
            >
              View Pricing
            </button>
          </div>

          {/* Social proof */}
          <p className="text-zinc-500 text-sm mt-8">
            Join 2,700+ developers already building with AI
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Everything you need to build fast
          </h2>
          <p className="text-zinc-400 text-center mb-12">Three steps from idea to website</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={24} className="text-purple-400" />,
                title: "Instant Generation",
                description: "Type a prompt, get a full website in under 10 seconds. Powered by LLaMA 3.3 70B."
              },
              {
                icon: <Globe size={24} className="text-purple-400" />,
                title: "Beautiful Designs",
                description: "AI generates modern, responsive sites with professional styling and animations."
              },
              {
                icon: <Download size={24} className="text-purple-400" />,
                title: "Export & Own",
                description: "Download the HTML file or refine it with chat. You own your code completely."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-purple-800 transition-colors">
                <div className="w-12 h-12 bg-purple-950 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Describe", desc: "Tell the AI what kind of website you need in plain English" },
              { step: "02", title: "Generate", desc: "AI builds the complete HTML, CSS, and JavaScript in seconds" },
              { step: "03", title: "Download", desc: "Preview it live, refine with chat, then download or copy the code" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-purple-900 mb-4">{item.step}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example websites */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">What can you build?</h2>
          <p className="text-zinc-400 text-center mb-12">Any website, any style, in seconds</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Portfolio', 'Restaurant', 'SaaS Landing', 'Blog', 'Agency', 'E-Commerce'].map((type, i) => (
              <div
                key={i}
                onClick={() => { navigate(isSignedIn ? '/builder' : '/sign-up') }}
                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-purple-600 hover:bg-zinc-800 cursor-pointer transition-all group"
              >
                <p className="text-white font-medium group-hover:text-purple-400 transition-colors">{type}</p>
                <p className="text-zinc-500 text-sm mt-1">Click to build →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to build?</h2>
          <p className="text-zinc-400 mb-8">Start free with 5 credits. No credit card required.</p>
          <button
            onClick={handleStart}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-lg transition-all hover:scale-105 mx-auto"
          >
            Start Building Free <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Zap size={20} className="text-purple-500" fill="currentColor" />
            SiteBuilder AI
          </div>
          <p className="text-zinc-500 text-sm">© 2026 SiteBuilder AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors no-underline">Privacy</a>
            <a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors no-underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage