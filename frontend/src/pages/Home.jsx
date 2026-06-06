export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <div>
          <h1 className="section-heading">
            <span>🎵</span>
            <span>Welcome to MuWaveMatch</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Discover vibrant music communities and connect with fellow music enthusiasts in Nairobi. Find local events, build meaningful connections, and share your passion for music.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div key={idx} className="card p-6 space-y-3">
            <div className="text-4xl">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl p-12 text-white text-center space-y-4">
        <h2 className="text-3xl font-bold">Ready to Join the Music Community?</h2>
        <p className="text-lg opacity-90">Start connecting with music lovers today</p>
        <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
          Get Started
        </button>
      </section>
    </div>
  );
}
