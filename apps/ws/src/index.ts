import { WebSocketServer,WebSocket } from "ws";
import { verifyToken } from "@repo/comman";
import { UserManager } from "./UserManager";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws,req) => {
  console.log("New client connected");
 // now we can verify the token from the query params or headers
  const token = req.url?.split("?token=")[1] || req.headers.authorization?.split(" ")[1];
  if (!token) {
    ws.close(1008, "Unauthorized");
    return;
  }
  const user = verifyToken(token);
  if (!user) {
    ws.close(1008, "Unauthorized");
    return;
  }


    // Store the user in the UserManager
    // @ts-ignore
    UserManager.getInstance().addUser(user.id, ws);
});

console.log("WebSocket server is running on ws://localhost:8080");
