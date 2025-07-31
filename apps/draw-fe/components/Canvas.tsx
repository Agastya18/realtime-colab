'use client'; // if you're using Next.js App Router

import { useEffect, useRef,useState } from 'react';
import { Canvas ,Rect,Circle,Triangle} from 'fabric';
import { WS_URL } from '@/config';
export default function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  console.log(socket)
    useEffect(() => {
              const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZHIzZHBrejAwMDB5emtqdXVmdG0xemciLCJpYXQiOjE3NTM5NjQ1NDd9.PQuWCH5Ra2k4xpBF3o427MyHcCRgIxpU8hL0aVG1VqY`)
        setSocket(ws);
    
        ws.onopen = () => {
        console.log('WebSocket connection established');
        // You can send a message or perform actions after the connection is open
        ws.send(JSON.stringify({
    "type": "joinRoom",
    "userId": "user123",
    "roomId": "room456"
}));
        };
    
      
    
        ws.onclose = () => {
        console.log('WebSocket connection closed');
        };
    
        return () => {
        if (ws) {
            ws.close();
        }
        };
    }, []);
  useEffect(() => {
    const canvasInstance = new Canvas(canvasRef.current);
    setCanvas(canvasInstance);
  canvasInstance.renderAll();
    return () => {
      if (canvasInstance) {
        canvasInstance.dispose();
      }
    };
  }, []);
const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 50,
        height: 50,
      });
      canvas.add(rect);
    
    }
}
const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: 'blue',
        radius: 30,
      });
      canvas.add(circle);
    }
}

    // Add more shapes as needed
   const addTriangle = () => {
    if (canvas) {
      const triangle = new Triangle({
        left: 100,
        top: 100,
        fill: 'green',
        width: 50,
        height: 50,
      });
      canvas.add(triangle);
    }
  };

  if(!socket){
    return <div>Loading...</div>;
  }

  return (
  <div className='flex flex-col items-center justify-center h-screen '>
   {/* add tailwind css for the  */}
  <div id='nav' className='flex space-x-4 mb-4 bg-black p-3 rounded-lg shadow-lg'>
    <button onClick={addRectangle} className='bg-blue-500 text-white px-4 py-2 rounded'>Add Rectangle</button>
    <button onClick={addCircle} className='bg-blue-500 text-white px-4 py-2 rounded'>Add Circle</button>
    <button onClick={addTriangle} className='bg-blue-500 text-white px-4 py-2 rounded'>Add Triangle</button>
    <button onClick={() => canvas?.clear()} className='bg-red-500 text-white px-4 py-2 rounded'>Clear Canvas</button>
  </div>
   
      <canvas 
      className='border border-gray-300 rounded-lg shadow-lg  '
      ref={canvasRef}
      width={1200}
      height={700}
      style={{ border: '1px solid #ccc' }}
    />
   
  </div>
  );
}
