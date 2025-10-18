import prisma from "@/lib/prisma";

export const createWaitlistEntry = async (email: string) => {
  try {
    await prisma.waitlistEntry.create({
      data: { email },
    })
  } catch (e) {
    throw e;
  }
}
