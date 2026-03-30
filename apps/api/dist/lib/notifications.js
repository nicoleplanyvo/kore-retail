import prisma from './prisma.js';
export async function createNotification(opts) {
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
//# sourceMappingURL=notifications.js.map