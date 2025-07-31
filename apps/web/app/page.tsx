import Link from 'next/link';

export default function Home(){
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Realtime Colab
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Collaborate in real-time with drawing and chat features
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <Link 
            href="/auth/signin"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <Link 
            href="/chat"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Chat App
          </Link>
          <Link 
            href="/canvas"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Drawing Canvas
          </Link>
        </div>
      </div>
    </div>
  );
}