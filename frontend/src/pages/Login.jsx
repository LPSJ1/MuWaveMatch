import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(loginId, password);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo and Tagline */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        {/* Stacked Images Background - 3 Row Landscape */}
        <div className="absolute inset-0 flex flex-col">
          <img 
            src="/login-dj.png" 
            alt="DJ" 
            className="w-full h-1/3 object-cover"
          />
          <img 
            src="/login-crowd1.png" 
            alt="Crowd" 
            className="w-full h-1/3 object-cover"
          />
          <img 
            src="/login-guitarist.png" 
            alt="Guitarist" 
            className="w-full h-1/3 object-cover"
          />
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <img 
              src="/m-logo.png" 
              alt="MuWave Logo" 
              className="w-32 h-32 mx-auto object-contain"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '2px' }}>
            MUWAVE
          </h1>
          <p className="text-xl text-white/90">
            Matching and event Discovery
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-block">
              <img 
                src="/m-logo.png" 
                alt="MuWave Logo" 
                className="w-24 h-24 mx-auto object-contain"
              />
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2" style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '2px' }}>
              MUWAVE
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Matching and event Discovery
            </p>
          </div>

          {/* Jump Back In Heading */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Jump back in
            </h2>
          </div>

          {/* Login Card */}
          <div className="card p-8 space-y-6 shadow-2xl rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Email or Username Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Email or Username"
                  className="input-field w-full"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="input-field w-full"
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="text-center">
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn-primary w-full py-3"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'LOG IN'}
              </button>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-600 hover:text-orange-700 font-bold">
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


