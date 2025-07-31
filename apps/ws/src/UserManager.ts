
import { WebSocket } from "ws";
import { User } from "./User";
import { prisma } from "@repo/db";
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
    
        const user = new User(id, ws);
        this.users.set(id, user);
        console.log(`User id: ${id} added`);

        console.log("Current users with values:", Array.from(this.users.entries()).map(([key, value]) => ({ key, value })));
        // Set up WebSocket event listeners for the user
        this.OnCloseRemove(id, ws);
    }

    OnCloseRemove(id:string, ws: WebSocket): void {
       ws.on("close", () => {
          // Handle user disconnection logic here
        if (this.users.has(id)) {
            this.users.delete(id);
             console.log("Current users with values:", Array.from(this.users.entries()).map(([key, value]) => ({ key, value })));
            console.log(`User id: ${id} disconnected`);
        } else {
            console.log(`User id: ${id} not found`);
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
          //  console.log(`User ${parseData.userId} joined room ${parseData.roomId}`);
            // get the rooms array
         console.log("Current users with values:", Array.from(this.users.entries()).map(([key, value]) => ({ key, value })));

            console.log(`User ${parseData.userId} is now in rooms: ${user.rooms.join(", ")}`);
        }
    }

    leaveRoom(parseData: parseData): void {
        const user = this.getUser(parseData.userId);
        if (user) {
            user.rooms = user.rooms.filter(roomId => roomId !== parseData.roomId);
          //  console.log(`User ${parseData.userId} left room ${parseData.roomId}`);
            // get the rooms array
          console.log("Current users with values:", Array.from(this.users.entries()).map(([key, value]) => ({ key, value })));

            console.log(`User ${parseData.userId} is now in rooms: ${user.rooms.join(", ")}`);
           
        }
    }
      async handleChatMessage(parseData: parseData): Promise<void> {
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
        await prisma.chat.create({
            data: {
                userId: parseData.userId,
                roomId: Number(parseData.roomId),
                message: parseData.message || "",
            },
        })
        // Broadcast the message to all users in the room
        this.broadcastMessageToRoom(parseData.roomId, parseData.message || "");
        console.log(`User ${parseData.userId} sent message to room ${parseData.roomId}: ${parseData.message}`);
        // Log the current users and their rooms
        this.users.forEach((user, id) => {
            console.log(`User ${id} is in rooms: ${user.rooms.join(", ")}`);
        });
    }

    broadcastMessageToRoom(roomId: string, message: string): void {
        for (const user of this.users.values()) {
            if (user.rooms.includes(roomId)) {
                user.ws.send(JSON.stringify({ type: "message", roomId, message }));
            }
        }
        console.log(`Broadcasted message to room ${roomId}: ${message}`);
    }

  

    }

 

  
  