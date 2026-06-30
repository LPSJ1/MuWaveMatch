import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="mb-2">
            <img 
              src="/m-logo.png" 
              alt="MuWave Logo" 
              className="w-48 h-48 mx-auto object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            For musicians. For enthusiasts. For <span className="text-orange-600">all</span>.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover vibrant music communities and connect with fellow music enthusiasts in Nairobi. 
            Find local events, build meaningful connections, and share your passion for music.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            {isAuthenticated() ? (
              <>
                <Link 
                  to="/events" 
                  className="btn-primary px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Explore Events
                </Link>
                <Link 
                  to="/genres" 
                  className="btn-secondary px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Update Interests
                </Link>
              </>
            ) : (
              <Link 
                to="/register" 
                className="btn-primary px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Join MuWave
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MuWaveMatch?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to connect with the music community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Connect with Image */}
            <div className="card p-0 hover:scale-105 transition-transform duration-300 group overflow-hidden">
              <div className="relative h-48">
                <img 
                  src="/crowd.jpg" 
                  alt="Live music concert" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Connect
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Meet people who share your music taste and passion for live events. 
                  Build your network of music lovers.
                </p>
              </div>
            </div>

            {/* Feature 2 - Discover Events with Image */}
            <div className="card p-0 hover:scale-105 transition-transform duration-300 group overflow-hidden">
              <div className="relative h-48">
                <img 
                  src="/major_lazer_nairobi_confetti.jpg" 
                  alt="Music events" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Discover Events
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Find the best music events happening near you in Nairobi. 
                  Never miss a beat with personalized recommendations.
                </p>
              </div>
            </div>

            {/* Feature 3 - Build Community with Image */}
            <div className="card p-0 hover:scale-105 transition-transform duration-300 group overflow-hidden">
              <div className="relative h-48">
                <img 
                  src="/community.jpg" 
                  alt="Music community" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Build Community
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Join music communities and be part of something bigger. 
                  Share experiences and create lasting memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-orange-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-5xl font-bold">10+</div>
              <div className="text-xl opacity-90">Music Genres</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">50+</div>
              <div className="text-xl opacity-90">Monthly Events</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold">1000+</div>
              <div className="text-xl opacity-90">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gray-900 rounded-full border-4 border-orange-600 flex items-center justify-center text-4xl font-bold text-white mx-auto shadow-lg dark:bg-black">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Account
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up in seconds and tell us about your music preferences
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gray-900 rounded-full border-4 border-orange-600 flex items-center justify-center text-4xl font-bold text-white mx-auto shadow-lg dark:bg-black">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Genres
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your favorite music genres to get personalized matches
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gray-900 rounded-full border-4 border-orange-600 flex items-center justify-center text-4xl font-bold text-white mx-auto shadow-lg dark:bg-black">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Connect & Discover
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find events, meet people, and enjoy the music scene
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Ready to Join the Music Community?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start connecting with music lovers today and never miss an event
          </p>
          {!isAuthenticated() && (
            <Link 
              to="/register" 
              className="inline-block btn-primary px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all mt-4"
            >
              Join MuWave
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
