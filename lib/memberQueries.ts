import { prisma } from "@/lib/prisma";

export async function getFilteredMembers({
  search,
  status,
  plan,
}: {
  search?: string;
  status?: string;
  plan?: string;
}) {
  const normalizedSearch = search?.trim().toLowerCase();

  return prisma.member.findMany({
    where: {
      ...(search && {
        OR: [
          {
            firstName: {
              contains: normalizedSearch,
            },
          },
          {
            lastName: {
              contains: normalizedSearch,
            },
          },
          {
            phone: {
              contains: normalizedSearch,
            },
          },
        ],
      }),

      ...(plan && {
        memberships: {
          some: {
            planId: plan,
          },
        },
      }),

      ...(status === "active" && {
        memberships: {
          some: {
            active: true,
            endDate: {
              gte: new Date(),
            },
          },
        },
      }),

      ...(status === "paused" && {
        memberships: {
          some: {
            active: false,
          },
        },
      }),

      ...(status === "expired" && {
        memberships: {
          some: {
            endDate: {
              lt: new Date(),
            },
          },
        },
      }),
    },

    include: {
      _count: {
        select: {
          memberships: true,
        },
      },

      memberships: {
        include: {
          plan: true,
        },
        orderBy: {
          endDate: "desc",
        },
        take: 1,
      },
    },

    orderBy: {
      firstName: "asc",
    },
  });
}
