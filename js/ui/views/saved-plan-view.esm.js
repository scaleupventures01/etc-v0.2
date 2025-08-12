const sectionId = 'savedPlanSection';

function getSection(){ return document.getElementById(sectionId); }

export function showSaved(){
  const el = getSection();
  if (!el) return;
  el.classList.remove('hidden');
  if (!el.dataset.wired) {
    el.dataset.wired = '1';
    el.innerHTML = `
      <div>
        <h2>Saved Plan</h2>
        <p>Placeholder — plan features are out of scope for 2.1.1.2.</p>
      </div>
    `;
  }
}
export function hideSaved(){ getSection()?.classList.add('hidden'); }


