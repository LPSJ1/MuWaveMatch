import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interests } from '../services/api';

const GENRES = [
  { id: 1, name: 'Jazz', emoji: '??' },
  { id: 2, name: 'Hip-Hop', emoji: '??' },
  { id: 3, name: 'Electronic', emoji: '???' },
  { id: 4, name: 'Reggae', emoji: '??' },
  { id: 5, name: 'Afrobeats', emoji: '??' },
  { id: 6, name: 'Pop', emoji: '??' },
  { id: 7, name: 'Rock', emoji: '??' },
  { id: 8, name: 'R&B', emoji: '??' },
  { id: 9, name: 'Classical', emoji: '??' },
  { id: 10, name: 'Blues', emoji: '??' },
  { id: 11, name: 'Soul', emoji: '??' },
  { id: 12, name: 'Jungle', emoji: '??' },
];

export default function GenreSelection() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

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

  const handleSave = async () => {
    if (selectedGenres.length < 2) {
      setError('Please select at least 2 genres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const savePromises = selectedGenres.map(genreId =>
        interests.save(genreId)
      );

      await Promise.all(savePromises);

      setSuccess(true);

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

  return (
    <div className="min-h-screen px-4 pb-24 pt-12">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-wide text-gray-900 dark:text-white uppercase">
            Select Your Sound
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Choose at least 2 genres you enjoy or you'd like to explore</p>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Interests saved! Redirecting to events...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {GENRES.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);

            return (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`
                  relative min-h-[160px] rounded-2xl border-2 transition-all duration-200 bg-white text-left px-6 py-6
                  ${isSelected
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-600 text-white text-xs"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></span>
                )}

                <span className="absolute bottom-4 right-4 text-sm font-medium uppercase tracking-wide text-gray-700 dark:text-gray-200">
                  {genre.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
          <button
            onClick={handleSave}
            disabled={loading || selectedGenres.length < 2}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}






