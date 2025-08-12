const sectionId = 'journalSection';

function getSection(){ return document.getElementById(sectionId); }

export function showJournal(){ getSection()?.classList.remove('hidden'); }
export function hideJournal(){ getSection()?.classList.add('hidden'); }


