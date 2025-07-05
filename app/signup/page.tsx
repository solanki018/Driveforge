'use client';
import { useState } from 'react';
import { supabase } from 'lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
        } else {
          setMessage('📧 Please check your email and click the confirmation link before logging in.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center">📝 Sign Up for DriveForge</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {/* Link to Login */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:underline hover:text-blue-300">
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
