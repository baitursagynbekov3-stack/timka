import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-soft-gray-50 dark:bg-soft-gray-950 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-soft-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
              <span className="text-white dark:text-soft-gray-900 font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-semibold text-soft-gray-900 dark:text-white">Lumina</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-soft-gray-800 rounded-2xl shadow-xl shadow-soft-gray-200/50 dark:shadow-soft-gray-900/50 p-8 border border-soft-gray-100 dark:border-soft-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-soft-gray-900 dark:text-white">Create your account</h1>
            <p className="text-soft-gray-500 dark:text-soft-gray-400 mt-2">Start learning with Lumina today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-soft-gray-700 dark:text-soft-gray-300 mb-2">
                Full name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-soft-gray-700 dark:text-soft-gray-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-soft-gray-700 dark:text-soft-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-soft-gray-700 dark:text-soft-gray-300 mb-2">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-center text-soft-gray-400 text-xs">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          {/* Login Link */}
          <p className="mt-6 text-center text-soft-gray-500 dark:text-soft-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-soft-gray-900 dark:text-white font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="mt-8 text-center">
          <Link to="/" className="text-soft-gray-500 dark:text-soft-gray-400 hover:text-soft-gray-700 dark:hover:text-soft-gray-300 text-sm">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
