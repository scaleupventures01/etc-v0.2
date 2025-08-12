import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function parseSession(cookieHeader?: string | null) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map(p => p.trim());
  const session = parts.find(p => p.startsWith('etc_session='));
  if (!session) return null;
  try {
    const payload = JSON.parse(decodeURIComponent(session.split('=')[1]));
    return payload;
  } catch {
    return null;
  }
}

export default function ProtectedPage() {
  const cookieStore = cookies();
  const raw = cookieStore.get('etc_session')?.value || null;
  let payload: any = null;
  try {
    payload = raw ? JSON.parse(decodeURIComponent(raw)) : null;
  } catch {
    payload = null;
  }

  if (!payload?.user) {
    return (
      <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1>Protected</h1>
        <p>Not authenticated. <a href="/auth/login">Login</a></p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Protected</h1>
      <p>Welcome, {payload.user.email}!</p>
      <form action="/api/auth/logout" method="post" suppressHydrationWarning>
        <button type="submit">Logout</button>
      </form>
    </main>
  );
}


