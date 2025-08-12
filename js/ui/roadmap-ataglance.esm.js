/**
 * Update At-a-Glance phase cards progress bars based on WBS counts.
 * counts: Map of phase label (e.g., 'M2 — File Architecture Split') to
 * { done, inprog, ready, planned, blocked }
 */
export function updatePhaseCards(doc, counts){
  const cards = doc.querySelectorAll('.phase-cards a');
  cards.forEach(function(card){
    const titleEl = card.querySelector('h4');
    const barSpan = card.querySelector('div > span');
    const barContainer = barSpan ? barSpan.parentElement : null;
    const pctEl = card.querySelector('[data-pct]');
    if(!titleEl || !barSpan){
      return;
    }
    const title = titleEl.innerText.trim();
    const phasePrefix = title.split('—')[0].trim();
    const key = Array.from(counts.keys()).find(k=>k.startsWith(phasePrefix));
    let pct = 0;
    if(key){
      const c = counts.get(key);
      const total = (c.done + c.inprog + c.ready + c.planned + c.blocked) || 1;
      pct = Math.round((c.done / total) * 100);
    }
    barSpan.style.width = pct + '%';
    // Color: green at 100%, yellow otherwise (if >0). 0% shows no fill.
    barSpan.style.background = pct === 100 ? '#28a745' : '#f1c40f';
    // Add white border to the bar container for visibility
    if(barContainer){
      barContainer.style.border = '1px solid #ffffff';
    }
    if(pctEl){
      pctEl.textContent = pct + '%';
    }
  });
}


