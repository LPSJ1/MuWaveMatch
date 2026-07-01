import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { matches } from '../services/api';

export default function MatchResults() {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  // Fetch matches from backend
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await matches.getMatches();
        setMatchData(data);
      } catch (err) {
        setError('Failed to load matches. Please try again later.');
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Redirect to home if not logged in
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding your music matches...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // No matches yet
  if (!matchData || !matchData.matches || matchData.matches.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎵</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            No matches yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select more music interests to find better matches!
          </p>
        </div>
      </div>
    );
  }

  // Get match score color based on percentage
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-blue-100 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 border-yellow-300';
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Your Music Matches
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            People who share your music taste
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchData.matches.map((match, index) => (
            <div
              key={match.user_id || index}
              className="card p-6 space-y-4 hover:scale-105 transition-transform"
            >
              {/* Rank Badge */}
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-3xl text-white ring-4 ring-orange-100 dark:ring-orange-900/40">
                  👤
                </div>
                <div className={`px-3 py-1 rounded-full border-2 font-bold ${getScoreBg(match.match_score)}`}>
                  <span className={getScoreColor(match.match_score)}>
                    {match.match_score}%
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {match.user_name || `User ${index + 1}`}
                </h3>
              </div>

              {/* Match Score Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Match Score</span>
                  <span className={`font-semibold ${getScoreColor(match.match_score)}`}>
                    {match.match_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      match.match_score >= 80 ? 'bg-green-500' :
                      match.match_score >= 60 ? 'bg-blue-500' :
                      match.match_score >= 40 ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${match.match_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Shared Genres */}
              {match.shared_genres && match.shared_genres.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Shared Interests:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {match.shared_genres.map((genre, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {match.instagram ? (
                <a
                  href={`https://instagram.com/${match.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-2 text-center block"
                >
                  Connect on Instagram
                </a>
              ) : (
                <button disabled className="btn-primary w-full py-2 opacity-40 cursor-not-allowed">
                  No Instagram set
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="card p-6 border-2 border-gray-900 bg-orange-50 dark:border-white dark:bg-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {matchData.matches.length}
              </div>
              <p className="text-gray-600 dark:text-gray-400">Total Matches</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {matchData.matches.filter(m => m.match_score >= 80).length}
              </div>
              <p className="text-gray-600 dark:text-gray-400">High Compatibility</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {matchData.matches.length > 0 
                  ? Math.round(matchData.matches.reduce((sum, m) => sum + m.match_score, 0) / matchData.matches.length)
                  : 0}%
              </div>
              <p className="text-gray-600 dark:text-gray-400">Average Match</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
