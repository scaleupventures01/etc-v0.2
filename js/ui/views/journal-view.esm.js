const sectionId = 'journalSection';

function getSection(){ return document.getElementById(sectionId); }

export function showJournal(){
  const el = getSection();
  if (!el) return;
  el.classList.remove('hidden');
  if (!el.dataset.wired) {
    el.dataset.wired = '1';
    el.innerHTML = `
      <div>
        <h2>Journal</h2>
        <div style="margin:8px 0;">
          <label>Symbol <input id="jSymbol"/></label>
          <label>Side <select id="jSide"><option>long</option><option>short</option></select></label>
          <label>Size <input id="jSize" type="number" value="1"/></label>
          <label>Entry <input id="jEntry" type="number" value="100"/></label>
          <label>Exit <input id="jExit" type="number" value="101"/></label>
          <label><input id="jSnap" type="checkbox" checked/> Include verdict snapshot</label>
          <button id="btnJournalCreate">Create Entry</button>
        </div>
        <div>
          <h3>Entries</h3>
          <ul id="jList"></ul>
        </div>
      </div>
    `;
    wireJournal(el);
  }
}

export function hideJournal(){ getSection()?.classList.add('hidden'); }

async function wireJournal(root) {
  const { Journal, Verdict } = await import('../../modules/index.js');
  const listEl = root.querySelector('#jList');
  function renderList() {
    const entries = Journal.list();
    listEl.innerHTML = entries.map(e => `<li>${e.trade?.symbol ?? ''} ${e.trade?.side ?? ''} size ${e.trade?.size ?? ''} — ${e.verdictSnapshot?.verdict ?? 'n/a'}</li>`).join('');
  }
  renderList();
  root.querySelector('#btnJournalCreate')?.addEventListener('click', () => {
    try {
      const tradeText = [
        root.querySelector('#jSymbol').value,
        root.querySelector('#jSide').value,
        root.querySelector('#jSize').value,
        root.querySelector('#jEntry').value,
        root.querySelector('#jExit').value
      ].join(' ');
      const includeSnap = root.querySelector('#jSnap').checked;
      const trade = { symbol: root.querySelector('#jSymbol').value, side: root.querySelector('#jSide').value, size: Number(root.querySelector('#jSize').value), entry: Number(root.querySelector('#jEntry').value), exit: Number(root.querySelector('#jExit').value) };
      const verdictSnapshot = includeSnap ? Verdict.evaluateTradeText(trade) : undefined;
      Journal.create({ trade, verdictSnapshot });
      renderList();
    } catch (e) {
      console.error(e);
      alert('Failed to create journal entry');
    }
  });
}


