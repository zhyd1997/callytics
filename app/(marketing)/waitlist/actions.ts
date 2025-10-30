'use server';

import { z } from "zod";
import type { WaitlistState } from "@/lib/schemas/waitlist";
import { waitlistFormSchema } from "@/lib/schemas/waitlist";
import { createWaitlistEntry } from "@/lib/dal/waitlist";

export async function joinWaitlist(initialState: WaitlistState, formData: FormData) {
  try {
    const validatedFields = waitlistFormSchema.safeParse({
      email: formData.get("email"),
    });

    if (!validatedFields.success) {
      return {
        message: z.treeifyError(validatedFields.error).errors.flat().join("\n"),
      };
    }

    const { email } = validatedFields.data;

    await createWaitlistEntry(email);

    return {
      message: "Success",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
