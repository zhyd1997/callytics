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
    const statusCode = error instanceof Error && "statusCode" in error
      ? (error as { statusCode: number }).statusCode
      : 500;

    console.error("[Waitlist Action Error]", {
      action: "joinWaitlist",
      statusCode,
      error: {
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
      },
      timestamp: new Date().toISOString(),
    });

    return {
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
