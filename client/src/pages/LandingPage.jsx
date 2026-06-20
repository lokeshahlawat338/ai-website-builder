import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Navbar from '../components/Navbar'
import { Zap, Download, ArrowRight, Sparkles, Code, Eye, Globe } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const handleStart = () => {
    navigate(isSignedIn ? '/builder' : '/sign-up')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', overflowX: 'hidden' }}>
      <Navbar />

      {/* Gradient blob */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '-100px', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: '140px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.25)',
            color: '#c4b5fd', fontSize: '13px', fontWeight: 500,
            marginBottom: '32px',
          }}>
            <Zap size={13} fill="currentColor" />
            Powered by LLaMA AI — Free to get started
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-1px',
            color: '#fff',
            marginBottom: '24px',
          }}>
            Build any website in
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              seconds with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '18px', color: '#a1a1aa', lineHeight: 1.7,
            maxWidth: '520px', margin: '0 auto 40px',
          }}>
            Describe your idea. Our AI generates a complete, beautiful website instantly. No coding required.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              onClick={handleStart}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', borderRadius: '12px',
                background: '#7c3aed', color: '#fff',
                border: 'none', fontSize: '15px', fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 0 0 0 rgba(124,58,237,0)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
              onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
            >
              Start Building Free
              <ArrowRight size={17} />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              style={{
                padding: '14px 28px', borderRadius: '12px',
                background: 'transparent', color: '#d4d4d8',
                border: '1px solid #3f3f46', fontSize: '15px', fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#3f3f46'}
            >
              View Pricing
            </button>
          </div>

          {/* Social proof */}
          <p style={{ color: '#52525b', fontSize: '13px' }}>
            Join 2,700+ developers already building with AI
          </p>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px', maxWidth: '500px', margin: '48px auto 0',
          }}>
            {[['10K+', 'Websites'], ['2K+', 'Users'], ['99.9%', 'Uptime']].map(([v, l]) => (
              <div key={l} style={{
                padding: '20px 16px', borderRadius: '16px',
                background: 'rgba(24,24,27,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{v}</p>
                <p style={{ fontSize: '12px', color: '#71717a' }}>{l}</p>
              </div>
            ))}
          </div>

          {/* Browser Mockup */}
          <div style={{
            marginTop: '64px',
            borderRadius: '20px',
            background: 'rgba(24,24,27,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '16px',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', paddingLeft: '4px' }}>
              {['#ef4444','#f59e0b','#22c55e'].map(c => (
                <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c + 'cc' }} />
              ))}
            </div>
            <div style={{
              borderRadius: '12px', background: '#0d0d10',
              border: '1px solid rgba(255,255,255,0.05)', padding: '20px',
            }}>
              <div style={{
                height: '44px', borderRadius: '8px',
                background: 'rgba(124,58,237,0.12)',
                marginBottom: '16px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '10px',
              }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(124,58,237,0.4)' }} />
                <div style={{ height: '8px', width: '120px', background: '#3f3f46', borderRadius: '4px' }} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  {[80,80,80].map((w,i) => (
                    <div key={i} style={{ height: '8px', width: `${w}px`, background: '#3f3f46', borderRadius: '4px' }} />
                  ))}
                </div>
              </div>
              <div style={{
                height: '80px', borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(168,85,247,0.08))',
                marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ height: '10px', width: '160px', background: '#52525b', borderRadius: '5px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{
                    height: '80px', borderRadius: '8px',
                    background: 'rgba(39,39,42,0.6)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              Everything you need to build fast
            </h2>
            <p style={{ color: '#71717a', fontSize: '16px' }}>Three steps from idea to live website</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { icon: <Sparkles size={20} style={{ color: '#a855f7' }} />, title: 'Instant Generation', desc: 'Type a prompt, get a full website in under 10 seconds powered by LLaMA 3.3 70B.' },
              { icon: <Code size={20} style={{ color: '#a855f7' }} />, title: 'Chat Refinement', desc: 'Refine your website with natural language. Change colors, add sections, update content.' },
              { icon: <Download size={20} style={{ color: '#a855f7' }} />, title: 'Export & Own', desc: 'Download the complete HTML. You own the code — no lock-in, no subscriptions.' },
            ].map((f, i) => (
              <div key={i} style={{
                padding: '28px',
                background: 'rgba(24,24,27,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                backdropFilter: 'blur(16px)',
              }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '17px', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>How it works</h2>
          <p style={{ color: '#71717a', fontSize: '16px', marginBottom: '56px' }}>From idea to website in 3 simple steps</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>
            {[
              { step: '01', icon: <Code size={18} style={{ color: '#a855f7' }} />, title: 'Describe', desc: 'Tell the AI what kind of website you need in plain English' },
              { step: '02', icon: <Sparkles size={18} style={{ color: '#a855f7' }} />, title: 'Generate', desc: 'AI builds complete HTML, CSS, and JavaScript in seconds' },
              { step: '03', icon: <Eye size={18} style={{ color: '#a855f7' }} />, title: 'Download', desc: 'Preview live, refine with chat, then download your code' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '12px',
                }}>
                  {item.icon}
                </div>
                <p style={{ fontSize: '56px', fontWeight: 900, color: 'rgba(63,63,70,0.5)', lineHeight: 1, marginBottom: '8px' }}>{item.step}</p>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '17px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#71717a', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>What can you build?</h2>
            <p style={{ color: '#71717a', fontSize: '16px' }}>Any website, any style, in seconds</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { type: 'Portfolio', desc: 'Showcase your work' },
              { type: 'Restaurant', desc: 'Menu & reservations' },
              { type: 'SaaS Landing', desc: 'Convert visitors' },
              { type: 'Blog', desc: 'Share your thoughts' },
              { type: 'Agency', desc: 'Win more clients' },
              { type: 'E-Commerce', desc: 'Sell your products' },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(isSignedIn ? '/builder' : '/sign-up')}
                style={{
                  padding: '24px',
                  background: 'rgba(24,24,27,0.7)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <p style={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}>{item.type}</p>
                <p style={{ color: '#52525b', fontSize: '13px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '64px 40px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(168,85,247,0.05))',
            border: '1px solid rgba(124,58,237,0.2)',
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Ready to build?</h2>
            <p style={{ color: '#71717a', fontSize: '16px', marginBottom: '32px' }}>Start free with 5 credits. No credit card required.</p>
            <button
              onClick={handleStart}
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
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 700 }}>
            <Zap size={18} fill="currentColor" style={{ color: '#a855f7' }} />
            SiteBuilder AI
          </div>
          <p style={{ color: '#52525b', fontSize: '13px' }}>© 2026 SiteBuilder AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: '#52525b', fontSize: '13px', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: '#52525b', fontSize: '13px', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage