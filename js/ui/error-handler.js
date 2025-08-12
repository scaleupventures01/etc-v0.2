(function initUIErrorHandler(global){
  const UIErrorHandler = {
    captureError: function captureError(error){
      try {
        const message = (error && error.message) ? error.message : String(error);
        sessionStorage.setItem('lastError', message);
      } catch {}
      if (global && global.console) {
        console.warn('[UIErrorHandler.captureError]', error);
      }
    }
  };
  global.UIErrorHandler = UIErrorHandler;
})(window);


