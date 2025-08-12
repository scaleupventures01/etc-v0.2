import { AppConfig } from './config.esm.js';
import { StorageCore } from './storage.esm.js';
import * as Utils from './utils.esm.js';
import { UIComponents } from '../ui/components.esm.js';
import { UINavigation } from '../ui/navigation.esm.js';
import { UIErrorHandler } from '../ui/error-handler.esm.js';
import { TradingPlan } from '../modules/trading-plan.esm.js';
import { Verdict } from '../modules/verdict.esm.js';
import { Journal } from '../modules/journal.esm.js';
import { Tenant } from '../modules/tenant.esm.js';

export function createApp(overrides = {}) {
  const config = overrides.config ?? AppConfig;
  const storage = overrides.storage ?? StorageCore;
  const utils = overrides.utils ?? Utils;
  const ui = overrides.ui ?? { components: UIComponents, navigation: UINavigation, errors: UIErrorHandler };
  const modules = overrides.modules ?? { TradingPlan, Verdict, Journal, Tenant };

  return { config, storage, utils, ui, modules };
}


