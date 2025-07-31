import { UserManager } from "./UserManager";

import {  WebSocket } from "ws";

interface parseData {
    type: "joinRoom" | "leaveRoom" | "sendMessage";
    userId: string; // Added userId to identify the user
    roomId: string;
    message?: string; // Optional for chat messages
}


export class User { 
    id:string;
    ws: WebSocket;
    rooms: string[]; // Array to store room IDs the user is part of

    constructor(id:string, ws: WebSocket) {
        this.id=id;
        this.ws = ws;
        this.rooms = [];
        this.listener();
    }

    // Method to join a room

    listener(): void {
        this.ws.on("message",async (data) => {

            let parseData: parseData;
            try {
                parseData = JSON.parse(data.toString());
            } catch (error) {
                console.error("Error parsing message:", error);
                return;
            }

            switch (parseData.type) {
                case "joinRoom":
                   UserManager.getInstance().JoinRoom(parseData);
                    break;
                case "leaveRoom":
                   UserManager.getInstance().leaveRoom(parseData);
                    break;
                case "sendMessage":
                   UserManager.getInstance().handleChatMessage(parseData);
                    break;
                default:
                    console.error("Unknown message type:", parseData.type);
            }
        });
    }
 
}