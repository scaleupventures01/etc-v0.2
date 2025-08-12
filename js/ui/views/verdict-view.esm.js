const sectionId = 'verdictSection';

function getSection(){ return document.getElementById(sectionId); }

export function showVerdict(){ getSection()?.classList.remove('hidden'); }
export function hideVerdict(){ getSection()?.classList.add('hidden'); }


