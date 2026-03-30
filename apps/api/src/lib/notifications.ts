import prisma from './prisma.js';

export async function createNotification(opts: {
  tenantId: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}): Promise<void> {
  await prisma.notification.create({
    data: {
      tenantId: opts.tenantId,
      userId: opts.userId,
      type: opts.type,
      title: opts.title,
      body: opts.body ?? null,
      link: opts.link ?? null,
    },
  });
}
