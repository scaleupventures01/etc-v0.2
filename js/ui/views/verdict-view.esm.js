const sectionId = 'verdictSection';

function getSection(){ return document.getElementById(sectionId); }

export function showVerdict(){
  const el = getSection();
  if (!el) return;
  el.classList.remove('hidden');
  if (!el.dataset.wired) {
    el.dataset.wired = '1';
    el.innerHTML = `
      <div>
        <h2>Verdict</h2>
        <div style="margin:8px 0;">
          <label>Trade (symbol side size entry exit) <input id="tradeTextV" placeholder="AAPL long 1 100 103"/></label>
          <button id="btnEvaluateV">Evaluate</button>
        </div>
        <pre id="evalOutV" style="background:#111;color:#0f0;padding:8px;min-height:48px;"></pre>
      </div>
    `;
    wireVerdict(el);
  }
}

export function hideVerdict(){ getSection()?.classList.add('hidden'); }

async function wireVerdict(root){
  const { Verdict } = await import('../../modules/index.js');
  root.querySelector('#btnEvaluateV')?.addEventListener('click', () => {
    try {
      const text = root.querySelector('#tradeTextV').value;
      const res = Verdict.evaluateTradeText(text);
      root.querySelector('#evalOutV').textContent = JSON.stringify(res, null, 2);
    } catch (e) {
      console.error(e);
      alert('Failed to evaluate');
    }
  });
}


