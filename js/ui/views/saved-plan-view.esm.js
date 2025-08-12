const sectionId = 'savedPlanSection';

function getSection(){ return document.getElementById(sectionId); }

export function showSaved(){ getSection()?.classList.remove('hidden'); }
export function hideSaved(){ getSection()?.classList.add('hidden'); }


