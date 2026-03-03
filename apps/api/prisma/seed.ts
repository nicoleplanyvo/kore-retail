import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Kore Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@koreretail.de' },
    update: {},
    create: {
      email: 'admin@koreretail.de',
      name: 'KORE Admin',
      passwordHash: hashSync('admin1234', 12),
      role: 'kore_admin',
    },
  });
  console.log(`✓ Admin User erstellt: ${admin.email}`);

  // Demo-Tenants
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'modehouse-mueller' },
    update: {},
    create: {
      name: 'Modehouse Müller',
      slug: 'modehouse-mueller',
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
      contactEmail: 'info@modehouse-mueller.de',
      contactName: 'Thomas Müller',
      contactPhone: '+49 211 1234567',
      maxUsers: 50,
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'boutique-schmidt' },
    update: {},
    create: {
      name: 'Boutique Schmidt',
      slug: 'boutique-schmidt',
      plan: 'STARTER',
      status: 'ACTIVE',
      contactEmail: 'kontakt@boutique-schmidt.de',
      contactName: 'Anna Schmidt',
      contactPhone: '+49 221 7654321',
      maxUsers: 15,
    },
  });

  const tenant3 = await prisma.tenant.upsert({
    where: { slug: 'luxus-retail-gmbh' },
    update: {},
    create: {
      name: 'Luxus Retail GmbH',
      slug: 'luxus-retail-gmbh',
      plan: 'ENTERPRISE',
      status: 'TRIALING',
      contactEmail: 'management@luxus-retail.de',
      contactName: 'Dr. Markus Weber',
      contactPhone: '+49 89 9876543',
      maxUsers: 200,
    },
  });

  console.log(`✓ Demo-Tenants erstellt: ${tenant1.name}, ${tenant2.name}, ${tenant3.name}`);

  // Tool-Zuweisungen
  await prisma.toolAssignment.createMany({
    data: [
      { tenantId: tenant1.id, tool: 'TRAIN' },
      { tenantId: tenant1.id, tool: 'PULSE' },
      { tenantId: tenant2.id, tool: 'TRAIN' },
      { tenantId: tenant3.id, tool: 'TRAIN' },
      { tenantId: tenant3.id, tool: 'PULSE' },
      { tenantId: tenant3.id, tool: 'SHIFT' },
    ],
    skipDuplicates: true,
  });

  console.log('✓ Tool-Zuweisungen erstellt');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
