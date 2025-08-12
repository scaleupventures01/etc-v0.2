const sectionId = 'wizardSection';

function getSection(){ return document.getElementById(sectionId); }

export function showWizard(){
  const el = getSection();
  if (!el) return;
  el.classList.remove('hidden');
  if (!el.dataset.wired) {
    el.dataset.wired = '1';
    el.innerHTML = `
      <div>
        <p>Plan wizard placeholder. Create a simple rule and evaluate a sample trade to demonstrate core v0.</p>
        <div style="margin:8px 0;">
          <label>Rule name <input id="ruleName" placeholder="Max size"/></label>
          <label>Max size <input id="ruleMax" type="number" value="2" min="0" max="999" step="1"/></label>
          <button id="btnCreateRule">Create Rule</button>
        </div>
        <div style="margin:8px 0;">
          <label>Trade (symbol side size entry exit) <input id="tradeText" placeholder="AAPL long 3 100 105"/></label>
          <button id="btnEvaluate">Evaluate</button>
        </div>
        <pre id="evalOut" style="background:#111;color:#0f0;padding:8px;min-height:48px;"></pre>
      </div>
    `;
    wireEvents(el);
  }
}

export function hideWizard(){ getSection()?.classList.add('hidden'); }

async function wireEvents(root) {
  const { Rules, Verdict } = await import('../../modules/index.js');
  root.querySelector('#btnCreateRule')?.addEventListener('click', () => {
    try {
      const name = root.querySelector('#ruleName').value;
      const max = Number(root.querySelector('#ruleMax').value || 0);
      Rules.create({ name, params: { predicate: 'size_max', max }, active: true, priority: 0 });
      alert('Rule created');
    } catch (e) {
      console.error(e);
      alert('Failed to create rule');
    }
  });
  root.querySelector('#btnEvaluate')?.addEventListener('click', () => {
    try {
      const text = root.querySelector('#tradeText').value;
      const res = Verdict.evaluateTradeText(text);
      root.querySelector('#evalOut').textContent = JSON.stringify(res, null, 2);
    } catch (e) {
      console.error(e);
      alert('Failed to evaluate');
    }
  });
}


