export const UIErrorHandler = {
  captureError(error) {
    try {
      const message = error && error.message ? error.message : String(error);
      sessionStorage.setItem('lastError', message);
    } catch {}
    console.warn('[UIErrorHandler.captureError]', error);
  }
};


