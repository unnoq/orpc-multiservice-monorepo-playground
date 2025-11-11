import { AuthGuard } from './components/AuthGuard'
import { ChatRoom } from './components/ChatRoom'
import { PlanetCreator } from './components/PlanetCreator'
import { PlanetsList } from './components/PlanetsList'

function App() {
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    window.location.reload()
  }

  return (
    <AuthGuard>
      {/* Navigation Bar */}
      <nav>
        <div className="nav-logo">oRPC Playground</div>

        <div className="nav-menu">
          <a href="#planets">Planets</a>
          <a href="#chat">Chat</a>
          <a href={import.meta.env.VITE_API_URL} target="_blank" rel="noopener noreferrer">
            API Reference
          </a>
        </div>

        <div className="nav-actions">
          <button className="btn-link" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        {/* Hero Section */}
        <section style={{ marginBottom: '80px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '20px' }}>oRPC Multiservice Monorepo</h1>
          <p
            style={{
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#666',
              fontWeight: 600,
              marginBottom: '40px',
            }}
          >
            TanStack Query Integration Playground
          </p>
          <div className="message message-success" style={{ maxWidth: '800px', margin: '0 auto' }}>
            ✨ Explore oRPC with real-time chat, infinite queries, and form mutations
          </div>
        </section>

        {/* Create Planet Section */}
        <section id="planets" style={{ marginBottom: '60px' }}>
          <PlanetCreator />
        </section>

        {/* List Planets Section */}
        <section style={{ marginBottom: '60px' }}>
          <PlanetsList />
        </section>

        {/* Chat Section */}
        <section id="chat">
          <ChatRoom />
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          padding: '40px',
          borderTop: '3px solid #1a1a1a',
          background: '#ffffff',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: '\'Courier New\', Courier, monospace',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
          }}
        >
          Built with oRPC + TanStack Query
        </p>
      </footer>
    </AuthGuard>
  )
}

export default App
