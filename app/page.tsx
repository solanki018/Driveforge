'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
      >
         DriveForge
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-10 text-gray-400 text-lg max-w-xl"
      >
        Your AI-powered file manager and summarizer
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-300 hover:scale-105"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-md transition-all duration-300 hover:scale-105"
        >
          Signup
        </Link>
      </motion.div>
    </main>
  );
}
