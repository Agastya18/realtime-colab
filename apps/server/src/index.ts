import express from "express";
import crypto from "crypto";
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
    const { data } = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        },
      });
  } catch (error) {
      console.error("Error during signup:", error);
    
  }
});
app.post("/login");


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});