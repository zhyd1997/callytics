import { z } from "zod";

export type WaitlistState = { message: string }

export const waitlistFormSchema = z.object({
  email: z.email("Invalid email").trim().nonempty("Email is required"),
})
