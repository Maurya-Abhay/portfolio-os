import { prisma } from '@/lib/db/prisma';

function hasPortfolioData(user: {
  projects: unknown[];
  skills: unknown[];
  experiences: unknown[];
  education: unknown[];
  achievements: unknown[];
}) {
  return Boolean(
    user.projects.length ||
    user.skills.length ||
    user.experiences.length ||
    user.education.length ||
    user.achievements.length,
  );
}

export async function getPortfolioOwner() {
  const configuredEmail = process.env.PORTFOLIO_OWNER_EMAIL?.trim().toLowerCase();

  const preferredOwner = configuredEmail
    ? await prisma.user.findUnique({
        where: { email: configuredEmail },
        include: {
          projects: { where: { published: true }, orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }], take: 6 },
          skills: { orderBy: { sortOrder: 'asc' } },
          experiences: { orderBy: { startDate: 'desc' } },
          education: { orderBy: { startDate: 'desc' } },
          achievements: { orderBy: { date: 'desc' } },
        },
      })
    : null;

  if (preferredOwner && hasPortfolioData(preferredOwner)) {
    return preferredOwner;
  }

  const ownerWithContent = await prisma.user.findFirst({
    where: {
      OR: [
        { projects: { some: {} } },
        { skills: { some: {} } },
        { experiences: { some: {} } },
        { education: { some: {} } },
        { achievements: { some: {} } },
      ],
    },
    include: {
      projects: { where: { published: true }, orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }], take: 6 },
      skills: { orderBy: { sortOrder: 'asc' } },
      experiences: { orderBy: { startDate: 'desc' } },
      education: { orderBy: { startDate: 'desc' } },
      achievements: { orderBy: { date: 'desc' } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return ownerWithContent ?? null;
}

export async function getPublishedProject(slug: string) {
  const owner = await getPortfolioOwner();
  if (!owner) return null;

  return prisma.project.findFirst({
    where: { slug, published: true, userId: owner.id },
  });
}
