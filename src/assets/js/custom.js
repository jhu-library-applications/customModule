console.log('Hello from custom.js');

(function() {
  'use strict';

  /* Override the number of items retrieved by the Holdings API.
  This is 10 by default, which is much too small for items with large amounts of holdings. */
  const HOLDINGS_URL_PATTERN = /\/primaws\/rest\/priv\/ILSServices\/holdings(\/[^?]+)?\?/;

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

    if (ALMA_ITEM_REQUEST_PATTERN.test(url)) {
      this._shouldInterceptAlmaRequest = true;
      // Mark for response interception on GET requests
      if (method.toUpperCase() === 'GET') {
        this._shouldInterceptAlmaResponse = true;
      }
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

    // AlmaItemRequest override for Office Delivery (POST request modification)
    if (this._shouldInterceptAlmaRequest && this._interceptedMethod.toUpperCase() === 'POST' && body) {
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

    // AlmaItemRequest response interception (for modifying pickup location names)
    if (this._shouldInterceptAlmaResponse) {
      const xhr = this;

      this.addEventListener('readystatechange', function() {
        if (xhr.readyState === 4) {
          try {
            const responseData = JSON.parse(xhr.responseText);

            // Modify the pickup location names
            if (responseData['services-arr'] && responseData['services-arr'].services) {
              responseData['services-arr'].services.forEach(function(service) {
                if (service['groups-list-map']) {
                  service['groups-list-map'].forEach(function(item) {
                    if (item.pickupLocation) {
                      item.pickupLocation.forEach(function(location) {
                        if (location.key === "126006350007861$$LIBRARY") {
                          location.value = "Milton S. Eisenhower Library - Annex";
                        }
                      });
                    }
                  });
                }
              });
            }

            // Override the response properties
            Object.defineProperty(xhr, 'responseText', {
              get: function() {
                return JSON.stringify(responseData);
              }
            });

            Object.defineProperty(xhr, 'response', {
              get: function() {
                return JSON.stringify(responseData);
              }
            });

          } catch (error) {
            console.log('Error modifying AlmaItemRequest response:', error);
          }
        }
      });
    }

    return originalSend.call(this, body);
  };

})();
