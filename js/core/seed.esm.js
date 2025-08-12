import { StorageCore } from './storage.esm.js';

function generateToken() {
  try {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }
}

/**
 * Idempotently seed the canonical Founder tenant and Admin user into localStorage.
 * - Requires env: VITE_FOUNDER_ADMIN_EMAIL for first-time user creation
 * - Never stores plaintext passwords; uses a one-time first_login_token instead
 */
export function seedFounderTenant() {
  const previousActive = StorageCore.TENANT.getActive();
  const founderTenantId = 'founder';
  const adminUserId = 'admin';

  // Ensure tenant exists and capture created_at once
  const nowIso = new Date().toISOString();
  const setActive = StorageCore.TENANT.setActive;
  const listTenants = StorageCore.TENANT.list;
  const save = StorageCore.saveToLocalStorage;
  const load = StorageCore.loadFromLocalStorage;

  const result = {
    tenant: { created: false },
    user: { created: false },
    message: ''
  };

  try {
    // Add tenant to list and switch namespace
    setActive(founderTenantId);

    // Tenant metadata (namespaced)
    const metaKey = 'etc_tenant_meta';
    const existingMeta = load(metaKey);
    if (!existingMeta || existingMeta.tenant_id !== founderTenantId) {
      const tenantMeta = {
        tenant_id: founderTenantId,
        name: 'Founder',
        created_at: existingMeta?.created_at || nowIso
      };
      save(metaKey, tenantMeta);
      result.tenant.created = !existingMeta;
    }

    // Users collection (namespaced)
    const usersKey = 'etc_users';
    const users = Array.isArray(load(usersKey)) ? load(usersKey) : [];
    const existingAdmin = users.find((u) => u && u.user_id === adminUserId);

    if (!existingAdmin) {
      const adminEmail = (import.meta?.env?.VITE_FOUNDER_ADMIN_EMAIL)
        || (typeof window !== 'undefined' && window.__env && window.__env.VITE_FOUNDER_ADMIN_EMAIL);
      if (!adminEmail || String(adminEmail).trim() === '') {
        throw new Error('Missing required env: VITE_FOUNDER_ADMIN_EMAIL');
      }
      const adminUser = {
        user_id: adminUserId,
        tenant_id: founderTenantId,
        email: String(adminEmail).trim(),
        role: 'admin',
        first_login_token: generateToken(),
        created_at: nowIso
      };
      const nextUsers = [...users, adminUser];
      save(usersKey, nextUsers);
      result.user.created = true;
    }

    const tenants = listTenants();
    result.message = `Seed ok. tenants=[${tenants.join(',')}]`;
  } catch (err) {
    result.message = `Seed aborted: ${err?.message || 'unknown error'}`;
    throw err;
  } finally {
    // Restore previous active tenant
    try { StorageCore.TENANT.setActive(previousActive); } catch { /* no-op */ }
  }

  return result;
}

// Optional harness for manual QA from devtools
if (typeof window !== 'undefined') {
  window.__seed = Object.assign(window.__seed || {}, { seedFounderTenant });
}


