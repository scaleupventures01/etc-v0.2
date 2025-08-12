// Core configuration constants
(function initAppConfig(global) {
  const AppConfig = {
    STORAGE_KEYS: {
      current: 'tradingPlan_current',
      draft: 'tradingPlan_draft',
      history: 'tradingPlan_history',
      lastAccessed: 'tradingPlan_lastAccessed',
      journal: 'journal_entries',
      rules: 'etc_rules_v1',
    },
  };

  global.AppConfig = AppConfig;
})(window);


