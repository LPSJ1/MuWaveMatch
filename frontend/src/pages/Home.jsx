export default function Home() {
  return (
    <div style={{ display: 'grid', gap: '3rem' }}>
      {/* Hero Section */}
      <section style={{ display: 'grid', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>🎵</span>
            <span>Welcome to MuWaveMatch</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.6' }}>
            Discover vibrant music communities and connect with fellow music enthusiasts in Nairobi. Find local events, build meaningful connections, and share your passion for music.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {[
          {
            icon: '🎤',
            title: 'Connect',
            description: 'Meet people who share your music taste and passion for live events.'
          },
          {
            icon: '📍',
            title: 'Discover Events',
            description: 'Find the best music events happening near you in Nairobi.'
          },
          {
            icon: '🌍',
            title: 'Build Community',
            description: 'Join music communities and be part of something bigger.'
          },
        ].map((feature, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', border: '1px solid #e5e7eb', transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{ fontSize: '2rem' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.75rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section style={{ background: 'linear-gradient(to right, #0284c7, #ec4899)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', display: 'grid', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white' }}>Ready to Join the Music Community?</h2>
        <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)' }}>Start connecting with music lovers today</p>
        <button style={{ backgroundColor: 'white', color: '#0284c7', fontWeight: '600', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', maxWidth: '200px', margin: '0 auto', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
          Get Started
        </button>
      </section>
    </div>
  );
}
