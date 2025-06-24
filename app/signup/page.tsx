'use client';
import { useState } from 'react';
import { supabase } from 'lib/supabaseClient';
import { useRouter } from 'next/navigation';

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

      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          // User is immediately confirmed, redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
        } else {
          // User needs to confirm email
          setMessage('Please check your email and click the confirmation link before logging in.');
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
    <main className="flex items-center justify-center min-h-screen p-6 bg-white">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Sign Up for DriveForge</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <button 
          onClick={handleSignup} 
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>
    </main>
  );
}