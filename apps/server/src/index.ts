import express from "express";
import crypto from "crypto";
import { prisma } from "@repo/db";
import { Request,Response } from "express";
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;



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

    const {username, email, name, password} = req.body;
    if (!username || !email || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const hashedPassword = hashPassword(password);
    // Check if user already exists
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
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isValidPassword = user.password === hashPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});