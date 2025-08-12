export async function POST() {
  return new Response(null, {
    status: 204,
    headers: {
      'set-cookie': 'etc_session=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
    }
  });
}


