import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenantName = process.env.FOUNDER_TENANT_NAME || 'Founder';
  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const firstLoginToken = process.env.ADMIN_FIRST_LOGIN_TOKEN;

  if (!adminEmail || (!passwordHash && !firstLoginToken)) {
    throw new Error('Missing ADMIN_EMAIL and either ADMIN_PASSWORD_HASH or ADMIN_FIRST_LOGIN_TOKEN');
  }

  const tenant = await prisma.tenant.upsert({
    where: { name: tenantName },
    update: {},
    create: { name: tenantName }
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      role: 'admin',
      tenantId: tenant.id,
      passwordHash: passwordHash || null,
      firstLoginToken: firstLoginToken || null
    }
  });

  // idempotent — second run no-ops due to upserts
}

main()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log('Seed complete');
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


