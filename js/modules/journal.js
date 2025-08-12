(function initJournalModule(global){
  const Journal = {
    saveEntry: function saveEntry(){
      if (typeof global.saveJournalEntry === 'function') return global.saveJournalEntry();
      throw new Error('saveJournalEntry is not available');
    }
  };
  global.Journal = Journal;
})(window);


