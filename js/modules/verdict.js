(function initVerdictModule(global){
  const Verdict = {
    evaluateTradeText: function evaluateTradeText(text, plan, options){
      if (typeof global.evaluateTradeText === 'function') return global.evaluateTradeText(text, plan, options);
      throw new Error('evaluateTradeText is not available');
    }
  };
  global.Verdict = Verdict;
})(window);


