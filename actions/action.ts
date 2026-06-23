// actions/action.ts
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

  if (!id) {
    throw new Error("Member ID is required");
  }

  if (!planId) {
    throw new Error("Plan ID is required");
  }

  // Update member details
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

  // Get the plan
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  // Get the latest membership
  const latestMembership = await prisma.membership.findFirst({
    where: { memberId: id },
    orderBy: { createdAt: "desc" },
  });

  // Only create new membership if plan changed or no membership exists
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
  redirect("/members?success=member-updated");
}

export async function deleteMember(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Member ID is required");
  }

  // Delete memberships first
  await prisma.membership.deleteMany({
    where: { memberId: id },
  });

  // Delete the member
  await prisma.member.delete({
    where: { id },
  });

  revalidatePath("/members");
  revalidatePath("/");
  redirect("/members?success=member-deleted");
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

  // Validate required fields
  if (!firstName || !lastName || !phone || !planId) {
    throw new Error("Required fields are missing");
  }

  // Check if phone number already exists
  const existingMember = await prisma.member.findUnique({
    where: { phone },
  });

  if (existingMember) {
    throw new Error("A member with this phone number already exists");
  }

  // Get the plan
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Selected plan not found.");
  }

  // Calculate membership dates
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  // Create member with membership
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

export async function renewMembership(formData: FormData) {
  const memberId = formData.get("memberId") as string;
  const planId = formData.get("planId") as string;

  if (!memberId || !planId) {
    throw new Error("Member ID and Plan ID are required");
  }

  // Get the plan
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  // Deactivate current active membership if exists
  await prisma.membership.updateMany({
    where: {
      memberId,
      active: true,
    },
    data: {
      active: false,
    },
  });

  // Calculate new dates
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  // Create new membership
  await prisma.membership.create({
    data: {
      memberId,
      planId,
      startDate,
      endDate,
      active: true,
    },
  });

  revalidatePath("/members");
  revalidatePath("/");
  redirect("/members?success=membership-renewed");
}

export async function createPlan(formData: FormData) {
  const name = formData.get("name") as string;
  const durationDays = parseInt(formData.get("durationDays") as string);
  const price = parseFloat(formData.get("price") as string);

  if (!name || !durationDays || !price) {
    throw new Error("All fields are required");
  }

  if (durationDays < 1) {
    throw new Error("Duration must be at least 1 day");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative");
  }

  const existingPlan = await prisma.plan.findUnique({
    where: { name },
  });

  if (existingPlan) {
    throw new Error("A plan with this name already exists");
  }

  await prisma.plan.create({
    data: {
      name,
      durationDays,
      price,
    },
  });

  revalidatePath("/admin/plans");
  redirect("/admin/plans");
}

export async function updatePlan(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const durationDays = parseInt(formData.get("durationDays") as string);
  const price = parseFloat(formData.get("price") as string);

  if (!id || !name || !durationDays || !price) {
    throw new Error("All fields are required");
  }

  if (durationDays < 1) {
    throw new Error("Duration must be at least 1 day");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative");
  }

  const existingPlan = await prisma.plan.findFirst({
    where: {
      name,
      NOT: {
        id,
      },
    },
  });

  if (existingPlan) {
    throw new Error("A plan with this name already exists");
  }

  await prisma.plan.update({
    where: { id },
    data: {
      name,
      durationDays,
      price,
    },
  });

  revalidatePath("/admin/plans");
  redirect("/admin/plans");
}

export async function deletePlan(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Plan ID is required");
  }

  const planWithMembers = await prisma.plan.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          memberships: true,
        },
      },
    },
  });

  if (planWithMembers && planWithMembers._count.memberships > 0) {
    throw new Error("Cannot delete plan with active memberships");
  }

  await prisma.plan.delete({
    where: { id },
  });

  revalidatePath("/admin/plans");
  redirect("/admin/plans");
}