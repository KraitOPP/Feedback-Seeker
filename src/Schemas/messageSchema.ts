import { z } from 'zod';

export const messageSchema = z.object({
    content: z.string()
            .min(10, "Content must be atleast 10 characters long")
            .max(300, "Content cannot be more than 300 characters")
})