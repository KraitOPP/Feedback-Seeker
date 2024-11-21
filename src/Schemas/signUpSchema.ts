import {z} from 'zod';

export const userNameValidation = z
    .string()
    .min(2, "User Name must be atleat 2 characters")
    .max(20, "User Name must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "UserName must not contain special characters");

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message:"Invalid Email Address"}),
    password: z.string().min(6, {message:"Password must be atleat 6 characters"})
})