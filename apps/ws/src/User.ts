import { UserManager } from "./UserManager";

import {  WebSocket } from "ws";

interface parseData {
    type: "joinRoom" | "leaveRoom" | "chat";
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

   private listener(): void {
        this.ws.on("message",async (data) => {

            let parseData: parseData;
            try {
                parseData = JSON.parse(data.toString());
            } catch (error) {
                console.error("Error parsing message:", error);
                return;
            }
            parseData.userId = this.id; // Ensure userId is set from the User instance
console.log("Received message:", parseData);
            switch (parseData.type) {
                case "joinRoom":
                   UserManager.getInstance().JoinRoom(parseData);
                    break;
                case "leaveRoom":
                   UserManager.getInstance().leaveRoom(parseData);
                    break;
                case "chat":
                   UserManager.getInstance().handleChatMessage(parseData);
                    break;
                default:
                    console.error("Unknown message type:", parseData.type);
            }
        });
    }
 
}