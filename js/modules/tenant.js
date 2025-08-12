(function initTenantModule(global){
  const Tenant = {
    getActive: function getActive(){ return global.StorageCore?.TENANT.getActive(); },
    setActive: function setActive(id){ return global.StorageCore?.TENANT.setActive(id); },
    list: function list(){ return global.StorageCore?.TENANT.list(); }
  };
  global.Tenant = Tenant;
})(window);


