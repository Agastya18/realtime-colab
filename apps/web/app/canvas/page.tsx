'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CanvasPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Drawing Canvas</h1>
            <div className="flex space-x-4">
              <Link 
                href="/chat"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Chat
              </Link>
              <Link 
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Canvas Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              This is where the collaborative drawing canvas will be implemented.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Features to be added:</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Real-time collaborative drawing</li>
                <li>• Multiple drawing tools</li>
                <li>• Shape creation</li>
                <li>• Layer management</li>
                <li>• WebSocket synchronization</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
