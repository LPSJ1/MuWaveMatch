import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interests } from '../services/api';

// Available music genres based on requirements
const GENRES = [
  { id: 1, name: 'Jazz', emoji: '🎷' },
  { id: 2, name: 'Hip-Hop', emoji: '🎤' },
  { id: 3, name: 'Electronic', emoji: '🎛️' },
  { id: 4, name: 'Reggae', emoji: '🎸' },
  { id: 5, name: 'Afrobeats', emoji: '🥁' },
  { id: 6, name: 'Pop', emoji: '🎤' },
  { id: 7, name: 'Rock', emoji: '🎸' },
  { id: 8, name: 'R&B', emoji: '🎵' },
  { id: 9, name: 'Classical', emoji: '🎻' },
  { id: 10, name: 'Blues', emoji: '🎷' },
];

export default function GenreSelection() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Toggle genre selection
  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
    setError('');
  };

  // Save selected genres to backend
  const handleSave = async () => {
    if (selectedGenres.length === 0) {
      setError('Please select at least one genre.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save each selected genre to backend
      const savePromises = selectedGenres.map(genreId =>
        interests.save(genreId)
      );

      await Promise.all(savePromises);
      
      setSuccess(true);
      
      // Redirect to events page after 1.5 seconds
      setTimeout(() => {
        navigate('/events');
      }, 1500);
      
    } catch (err) {
      setError('Failed to save interests. Please try again.');
      console.error('Error saving interests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to home if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Select Your Music Interests
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose the genres you love so we can match you with the right community
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Interests saved! Redirecting to events...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Genre Grid - Click to select/deselect */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            
            return (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`
                  p-6 rounded-lg border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 scale-105 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className="text-4xl mb-2">{genre.emoji}</div>
                <div className={`font-semibold ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {genre.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selection Count */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          {selectedGenres.length === 0 
            ? 'Select at least one genre to continue' 
            : `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''} selected`}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading || selectedGenres.length === 0}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save My Interests'}
          </button>
        </div>
      </div>
    </div>
  );
}