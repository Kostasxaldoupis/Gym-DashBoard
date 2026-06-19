"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function resumeSubscription(formData: FormData) {
  const membershipId = formData.get("membershipId") as string;

  await prisma.membership.update({
    where: {
      id: membershipId,
    },
    data: {
      active: true,
    },
  });

  revalidatePath("/members");
}

export async function pauseSubscription(formData: FormData) {
  const membershipId = formData.get("membershipId") as string

  await prisma.membership.update({
    where: {
      id: membershipId,
    },
    data: {
      active: false
    },
  })
  revalidatePath('/')
  revalidatePath('/members')
}

export async function editMember(formData: FormData) {
  const id = formData.get("id") as string;
  const planId = formData.get("planId") as string;

  await prisma.member.update({
    where: { id },
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || null,
      notes: (formData.get("notes") as string) || null,
    },
  });

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (plan) {
    const membership = await prisma.membership.findFirst({
      where: { memberId: id },
      orderBy: { createdAt: "desc" },
    });

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    if (membership) {
      await prisma.membership.create({
        data: {
          memberId: id,
          planId,
          startDate,
          endDate,
          active: true,
        },
      });
    }
  }

  revalidatePath("/");
  redirect("/");
}

export async function deleteMember(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.membership.deleteMany({
    where: {
      memberId: id,
    },
  });
  await prisma.member.delete({
    where: {
      id,
    },
  });
  revalidatePath("/");
  revalidatePath("/members");
  redirect("/members");
}

export async function createMember(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const email = (formData.get("email") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const planId = formData.get("planId") as string;

  const plan = await prisma.plan.findUnique({
    where: {
      id: planId,
    },
  });

  if (!plan) {
    throw new Error("Selected plan not found.");
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  await prisma.member.create({
    data: {
      firstName,
      lastName,
      phone,
      email,
      notes,
      memberships: {
        create: {
          planId,
          startDate,
          endDate,
          active: true,
        },
      },
    },
  });

  redirect("/");
}
