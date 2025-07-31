
import { WebSocket } from "ws";
interface User {
    ws: WebSocket;
    rooms: string[]; // Array to store room IDs the user is part of
    // Add any other user-related properties if needed
}
interface parseData {
    type: "joinRoom" | "leaveRoom" | "sendMessage";
    userId: string; // Added userId to identify the user
    roomId: string;
    message?: string; // Optional for chat messages
}
 export class UserManager {

    private   users: Map<string, User> = new Map();
    // Singleton pattern to ensure only one instance of UserManager exists

     private static instance: UserManager;
        public static getInstance(): UserManager {
            if (!UserManager.instance) {
                UserManager.instance = new UserManager();
            }
            return UserManager.instance;
        }
     private constructor(){
        // Initialize listeners for all users
       
        this.users = new Map<string, User>();

    }
    addUser(id: string, ws: WebSocket): void {
    
        const user: User = { ws, rooms: [] }; // Initialize with an empty rooms array
        this.users.set(id, user);
        console.log(`User ${id} added`);
        // Set up WebSocket event listeners for the user
        this.OnCloseRemove(id, ws);
    }

    OnCloseRemove(id:string, ws: WebSocket): void {
       ws.on("close", () => {
          // Handle user disconnection logic here
        if (this.users.has(id)) {
            this.users.delete(id);
            console.log(`User ${id} disconnected`);
        } else {
            console.log(`User ${id} not found`);
        }
       });
    }

    getUser(id: string): User | undefined {
        return this.users.get(id);
    }


    JoinRoom(parseData: parseData): void {
        const user = this.getUser(parseData.userId);
        if (user) {
            user.rooms.push(parseData.roomId);
            console.log(`User ${parseData.userId} joined room ${parseData.roomId}`);
        }
    }

    leaveRoom(parseData: parseData): void {
        const user = this.getUser(parseData.userId);
        if (user) {
            user.rooms = user.rooms.filter(roomId => roomId !== parseData.roomId);
            console.log(`User ${parseData.userId} left room ${parseData.roomId}`);
        }
    }
      handleChatMessage(parseData: any): void {
       // first check if the user exists
        const user = this.getUser(parseData.userId);
        if (!user) {
            console.error(`User ${parseData.userId} not found`);
            return;
        }
        // Check if the user is in the room
        if (!user.rooms.includes(parseData.roomId)) {
            console.error(`User ${parseData.userId} is not in room ${parseData.roomId}`);
            return;
        }
        // first save the message to the database
        // Then broadcast the message to all users in the room
        // Broadcast the message to all users in the room
    }

    }

 

  
  