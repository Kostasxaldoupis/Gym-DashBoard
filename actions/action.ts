"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper to lowercase Greek and Latin characters consistently
function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export async function resumeSubscription(formData: FormData) {
  const membershipId = formData.get("membershipId") as string;

  if (!membershipId) {
    throw new Error("Membership ID is required");
  }

  await prisma.membership.update({
    where: { id: membershipId },
    data: { active: true },
  });

  revalidatePath("/members");
  revalidatePath("/");
}

export async function pauseSubscription(formData: FormData) {
  const membershipId = formData.get("membershipId") as string;

  if (!membershipId) {
    throw new Error("Membership ID is required");
  }

  await prisma.membership.update({
    where: { id: membershipId },
    data: { active: false },
  });

  revalidatePath("/members");
  revalidatePath("/");
}

export async function editMember(formData: FormData) {
  const id = formData.get("id") as string;
  const planId = formData.get("planId") as string;

  if (!id || !planId) {
    throw new Error("Member ID and Plan ID are required");
  }

  await prisma.member.update({
    where: { id },
    data: {
      firstName: normalizeName(formData.get("firstName") as string),
      lastName: normalizeName(formData.get("lastName") as string),
      phone: (formData.get("phone") as string).trim(),
      email: (formData.get("email") as string) || null,
      notes: (formData.get("notes") as string) || null,
      dateOfBirth: formData.get("dateOfBirth")
        ? new Date(formData.get("dateOfBirth") as string)
        : null,
      emergencyContactName:
        (formData.get("emergencyContactName") as string) || null,
      emergencyContactPhone:
        (formData.get("emergencyContactPhone") as string) || null,
    },
  });

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  const latestMembership = await prisma.membership.findFirst({
    where: { memberId: id },
    orderBy: { createdAt: "desc" },
  });

  if (!latestMembership || latestMembership.planId !== planId) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

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

  revalidatePath("/members");
  revalidatePath("/");
  // redirect("/members");
  redirect("/members?success=member-created");
}

export async function deleteMember(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Member ID is required");
  }

  await prisma.membership.deleteMany({
    where: { memberId: id },
  });

  await prisma.member.delete({
    where: { id },
  });

  revalidatePath("/members");
  revalidatePath("/");
  // redirect("/members");
  redirect("/members?success=member-created");
}

export async function createMember(formData: FormData) {
  const firstName = normalizeName(formData.get("firstName") as string);
  const lastName = normalizeName(formData.get("lastName") as string);
  const phone = (formData.get("phone") as string).trim();
  const email = (formData.get("email") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const planId = formData.get("planId") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const emergencyContactName =
    (formData.get("emergencyContactName") as string) || null;
  const emergencyContactPhone =
    (formData.get("emergencyContactPhone") as string) || null;

  if (!firstName || !lastName || !phone || !planId) {
    throw new Error("Required fields are missing");
  }

  const existingMember = await prisma.member.findUnique({
    where: { phone },
  });

  if (existingMember) {
    throw new Error("A member with this phone number already exists");
  }

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Selected plan not found.");
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const member = await prisma.member.create({
    data: {
      firstName,
      lastName,
      phone,
      email,
      notes,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      emergencyContactName,
      emergencyContactPhone,
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

  revalidatePath("/members");
  revalidatePath("/");
  redirect(`/membercard/${member.cardCode}`);
}