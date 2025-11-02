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
      const { formErrors, fieldErrors } = validatedFields.error.flatten();
      const emailErrors = fieldErrors.email ?? [];
      const messages = [...emailErrors, ...formErrors].filter(Boolean);

      return {
        message: messages.join("\n") || "Invalid email address.",
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
