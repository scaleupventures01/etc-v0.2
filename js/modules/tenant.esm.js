import { StorageCore } from '../core/storage.esm.js';

export const Tenant = {
  getActive() {
    return StorageCore.TENANT.getActive();
  },
  setActive(id) {
    return StorageCore.TENANT.setActive(id);
  },
  list() {
    return StorageCore.TENANT.list();
  }
};


