import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SetUsername() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (value) => {
    // Remove @ symbol if user includes it
    const cleanUsername = value.replace(/@/g, '');
    
    // Check length
    if (cleanUsername.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    
    if (cleanUsername.length > 20) {
      return 'Username must be less than 20 characters';
    }
    
    // Check for valid characters (letters, numbers, underscores, hyphens)
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Save username to localStorage
      const cleanUsername = username.replace(/@/g, '');
      localStorage.setItem('username', cleanUsername);
      
      // Redirect to genres page after short delay
      setTimeout(() => {
        navigate('/genres');
      }, 500);
    } catch (err) {
      setError('Failed to save username. Please try again.');
      console.error('Error saving username:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-24 pt-12 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto space-y-8 text-center">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-wide text-gray-900 dark:text-white uppercase">
            Choose Your Username
          </h1>
          <p className="text-xl text-gray-900 dark:text-white font-medium">
            One more thing, your unique identity on MuWave
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-8 space-y-4">
            <div>
              <label 
                htmlFor="username" 
                className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your username"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                disabled={loading}
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Use letters, numbers, underscores, or hyphens (3-20 characters)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || username.trim().length < 3}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}