import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import fs from 'node:fs';
import path from 'node:path';

// Minimal .env loader to avoid adding dependencies
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
} catch {
  // best effort; continue
}

const prisma = new PrismaClient();

async function main() {
  const tenantName = process.env.FOUNDER_TENANT_NAME || 'Founder';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || (process.env.ADMIN_PASSWORD ? await argon2.hash(process.env.ADMIN_PASSWORD) : undefined);
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed complete');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


