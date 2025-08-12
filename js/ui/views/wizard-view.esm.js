const sectionId = 'wizardSection';

function getSection(){ return document.getElementById(sectionId); }

export function showWizard(){ getSection()?.classList.remove('hidden'); }
export function hideWizard(){ getSection()?.classList.add('hidden'); }


