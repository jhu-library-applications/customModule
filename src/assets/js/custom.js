console.log('Hello from custom.js');

(function() {
  'use strict';

  /* Override the number of items retrieved by the Holdings API.
  This is 10 by default, which is much too small for items with large amounts of holdings. */
  const HOLDINGS_URL_PATTERN = /\/primaws\/rest\/priv\/ILSServices\/holdings\?/;

  /* Override AlmaItemRequest to handle Office Delivery checkbox */
  const ALMA_ITEM_REQUEST_PATTERN = /\/AlmaItemRequest\?/;

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this._interceptedUrl = url;
    this._interceptedMethod = method;

    if (HOLDINGS_URL_PATTERN.test(url)) {
      this._shouldInterceptHoldings = true;
    }

    if (ALMA_ITEM_REQUEST_PATTERN.test(url) && method.toUpperCase() === 'POST') {
      this._shouldInterceptAlmaRequest = true;
    }

    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    // Holdings API override
    if (this._shouldInterceptHoldings && body) {
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

    // AlmaItemRequest override for Office Delivery
    if (this._shouldInterceptAlmaRequest && body) {
      try {
        const data = JSON.parse(body);

        if (data.genericCheckBox === 'Yes') {
          delete data.genericCheckBox;

          if (data.comment) {
            if (!data.comment.startsWith('Office Delivery Request:')) {
              data.comment = 'Office Delivery Request: ' + data.comment;
            }
          } else {
            data.comment = 'Office Delivery Request: ';
          }

          return originalSend.call(this, JSON.stringify(data));
        } else if (typeof data.genericCheckBox !== 'undefined') {
          delete data.genericCheckBox;
          return originalSend.call(this, JSON.stringify(data));
        }
      } catch (e) {
        console.log("Error overriding AlmaItemRequest: ", e);
      }
    }

    return originalSend.call(this, body);
  };

})();
