import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const MAX_FAILS = 5;
const LOCKOUT_MINUTES = 5;

const memoryFailMap = new Map<string, { fails: number; lockedUntil?: number }>();

function getLock(email: string) {
  const rec = memoryFailMap.get(email) || { fails: 0 };
  const now = Date.now();
  if (rec.lockedUntil && now < rec.lockedUntil) return rec;
  if (rec.lockedUntil && now >= rec.lockedUntil) {
    memoryFailMap.set(email, { fails: 0 });
    return { fails: 0 };
  }
  return rec;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }

    const lock = getLock(email);
    if (lock.lockedUntil && Date.now() < lock.lockedUntil) {
      return Response.json({ error: 'Account temporarily locked. Try again later.' }, { status: 429 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      const nextFails = (lock.fails || 0) + 1;
      const rec: any = { fails: nextFails };
      if (nextFails >= MAX_FAILS) rec.lockedUntil = Date.now() + LOCKOUT_MINUTES * 60_000;
      memoryFailMap.set(email, rec);
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      const nextFails = (lock.fails || 0) + 1;
      const rec: any = { fails: nextFails };
      if (nextFails >= MAX_FAILS) rec.lockedUntil = Date.now() + LOCKOUT_MINUTES * 60_000;
      memoryFailMap.set(email, rec);
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    memoryFailMap.set(email, { fails: 0 });

    const sessionPayload = { user: { id: user.id, email: user.email, tenantId: user.tenantId, role: user.role } };
    const cookieValue = encodeURIComponent(JSON.stringify(sessionPayload));

    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'set-cookie': `etc_session=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}${secureFlag}`
      }
    });
  } catch (err) {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
}


