export function onSavePlan() {
  throw new Error('onSavePlan not wired in ESM mode');
}

export function createEmptyWizardState() {
  return {};
}

export const TradingPlan = { onSavePlan, createEmptyWizardState };


