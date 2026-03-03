console.log('Hello from custom.js');

(function() {
  'use strict';

  /* Override the number of items retrieved by the Holdings API.
  This is 10 by default, which is much too small for items with large amounts of holdings. */
  const HOLDINGS_URL_PATTERN = /\/primaws\/rest\/priv\/ILSServices\/holdings\/\d+/;

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this._interceptedUrl = url;
    this._interceptedMethod = method;

    if (HOLDINGS_URL_PATTERN.test(url)) {
      this._shouldIntercept = true;
    }

    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    if (this._shouldIntercept && body) {
      try {
        const data = JSON.parse(body);

        if (data.filters && typeof data.filters.noItem !== 'undefined') {
          data.filters.noItem = 500; // Retrieve 500 each call
          return originalSend.call(this, JSON.stringify(data));
        }
      } catch (e) {
        console.log("Error overriding Holdings API: ", e);
      }
    }

    return originalSend.call(this, body);
  };

})();
