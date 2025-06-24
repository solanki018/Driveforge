import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">🚀 DriveForge</h1>
      <p className="mb-6 text-gray-600">Your AI-powered file manager and summarizer</p>
      <div className="space-x-4">
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </Link>
        <Link href="/signup" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          Signup
        </Link>
      </div>
    </main>
  );
}
