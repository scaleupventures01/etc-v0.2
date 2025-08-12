(function initTradingPlanModule(global){
  const TradingPlan = {
    onSavePlan: function onSavePlan() {
      if (typeof global.onSavePlan === 'function') return global.onSavePlan();
      throw new Error('onSavePlan is not available');
    },
    createEmptyWizardState: function createEmptyWizardState() {
      if (typeof global.createEmptyWizardState === 'function') return global.createEmptyWizardState();
      return {};
    },
  };
  global.TradingPlan = TradingPlan;
})(window);


