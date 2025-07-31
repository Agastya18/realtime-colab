"use client";

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZHJxdnJmZTAwMDF5emdzbmo3Y3ExZ3IiLCJpYXQiOjE3NTM5ODc1Mjl9.XXlUZs_b9wW4toxhjg3uC5SSLTcCqonCtH7IDdGReuA`)

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "joinRoom",
                roomId
            });
            console.log(data);
            ws.send(data)
        }
        
    }, [])
   
    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}