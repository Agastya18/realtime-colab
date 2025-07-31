'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  
  content: string;

  roomId: string;
}

export default function ChatPage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [roomId, setRoomId] = useState(1);
  const [userId, setUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  console.log("message",messages);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    // Extract user ID from token (simple decode - in production use proper JWT decode)
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3 && tokenParts[1]) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setUserId(payload.id || 'anonymous');
      } else {
        setUserId('anonymous');
      }
    } catch (err) {
      setUserId('anonymous');
    }

    // Initialize WebSocket connection
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      setError('');
      
      // Join the general room by default
      ws.send(JSON.stringify({
        type: 'joinRoom',
        userId: userId,
        roomId: roomId
      }));
    };

    ws.onmessage = (event) => {
      try {
     
        const data = JSON.parse(event.data);
        console.log("Received message:", data);
        
        if (data.type === 'chat') {
          const newMessage: Message = {
           
            content: data.message,
         
            roomId: data.roomId
          };
          setMessages(prev => [...prev, newMessage]);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error occurred');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId, router]);

  const sendMessage = () => {
    if (!socket || !currentMessage.trim()) return;

    const messageData = {
      type: 'chat',
      userId: userId,
      roomId: roomId,
      message: currentMessage.trim()
    };

    socket.send(JSON.stringify(messageData));
    setCurrentMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

 

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Realtime Chat</h2>
          <p className="text-sm text-gray-600">User: {userId}</p>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Rooms</h3>
         
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              # {roomId}
            </h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.content} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">{userId}</span> 
                <span className="text-gray-400">({formatTime(new Date().toISOString())})</span>
              </div>
              <p className="text-gray-800">{message.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !currentMessage.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
