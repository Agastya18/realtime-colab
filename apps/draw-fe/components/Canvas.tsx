'use client'; // if you're using Next.js App Router

import { useEffect, useRef,useState } from 'react';
import { Canvas ,Rect} from 'fabric';

export default function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

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
  return (
  <div className='flex flex-col items-center justify-center h-screen'>
    <button onClick={addRectangle}>Add Rectangle</button>
    <button onClick={() => canvas?.clear()}>Clear Canvas</button>
   
      <canvas 
      className='border border-gray-300 rounded-lg shadow-lg '
      ref={canvasRef}
      width={1200}
      height={700}
      style={{ border: '1px solid #ccc' }}
    />
  </div>
  );
}
