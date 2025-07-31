import {z} from "zod";
import jwt from "jsonwebtoken";

export const UserSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(5),

}); 
export const SigninSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string(),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})
// export type User = z.infer<typeof UserSchema>;


// now we can create a function to  to sign a JWT token using user id
export const signToken = (user: { id: string }) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET    || "default_secret");

  // what is the output structure of the function with example?
    // Example output:
    // {
    //   "id": "user_id"
    // }
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    return decoded;
  } catch (error) {
    return null;
  }
};


