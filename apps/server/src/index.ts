import express from "express";
import crypto from "crypto";
import { prisma } from "@repo/db";
import { UserSchema,signToken,CreateRoomSchema } from "@repo/comman";
import { Request,Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authMiddleware } from "./middleware";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent
  }
));
const PORT = process.env.PORT || 4000;



app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const hashPassword = (password:string) => {
    // Implement your hashing logic here
    // For example, using bcrypt or crypto
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};  
  

app.post("/signup", async(req: Request, res: Response) => {
  try {
    console.log("Received signup request");
    const {username, password} = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Validate user input using Zod schema
    const parsedUser = UserSchema.safeParse({ username, password });
    if (!parsedUser.success) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const hashedPassword = hashPassword(password);
    // Check if user already exists
  //  console.log("reacehd ehre")
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        },
      });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Validate user input using Zod schema
    const parsedUser = UserSchema.safeParse({ username, password });
    if (!parsedUser.success) {
      return res.status(400).json({ error: "Invalid input" });
    }
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });
    // If user does not exist or password is incorrect
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Compare password (assuming you have a hashPassword function)
    // Here we assume the password is stored as a hash in the database
    const isValidPassword = user.password === hashPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = signToken(user);
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      path: "/",
      
    });
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/logout", (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/room", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Room name is required" });
    }

    // Validate room name using Zod schema
    const parsedRoom = CreateRoomSchema.safeParse({ name });
    if (!parsedRoom.success) {
      return res.status(400).json({ error: "Invalid room name" });
    }
    // Create the room
    const room = await prisma.room.create({
      data: {
        slug: parsedRoom.data.name,
       adminId: req.user.id, // Assuming req.user is set by authMiddleware
      },
    });
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/chat/:roomId", authMiddleware, async (req: Request, res: Response) => {
  try {
   
    const roomId = Number(req.params.roomId);
    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }
    // Fetch the room and its messages
    const messages = await prisma.chat.findMany({
      where: { roomId },
      // get last 50 messages
      orderBy: { id: "desc" },
      take: 50,
     
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/room/:slug",authMiddleware, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    // Find the room by slug    
    const room = await prisma.room.findUnique({
      where: { slug },
    });
    res.status(200).json({ room });
  } catch (error) {
    console.error("Error creating chat message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  prisma.$disconnect()
    .then(() => {
      console.log("Prisma client disconnected");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error disconnecting Prisma client:", error);
      process.exit(1);
    });
});
