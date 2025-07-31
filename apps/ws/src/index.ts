import { WebSocketServer,WebSocket } from "ws";
import { verifyToken } from "@repo/comman";
import { UserManager } from "./UserManager";
const wss = new WebSocketServer({ port: 8080 });
function extractToken(req: any): string | null {
  // Try URL parameters first
  if (req.url) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const tokenFromUrl = url.searchParams.get('token');
    if (tokenFromUrl) return tokenFromUrl;
  }
  
  // Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try cookies if available
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenMatch = cookies.match(/token=([^;]+)/);
    if (tokenMatch) return tokenMatch[1];
  }
  
  return null;
}

wss.on("connection", (ws,req) => {
  console.log("New client connected");
 // now we can verify the token from the query params or headers
  const token = extractToken(req);
  console.log("Token:", token);
  if (!token) {
    ws.close(1008, "Unauthorized");
    return;
  }
  const user = verifyToken(token);
  console.log("User:", user);
  if (!user) {
    ws.close(1008, "Unauthorized");
    return;
  }


    // Store the user in the UserManager
    // @ts-ignore
    UserManager.getInstance().addUser(user.id, ws);
});

console.log("WebSocket server is running on ws://localhost:8080");
