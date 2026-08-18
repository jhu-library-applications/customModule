import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NDEEvent, NDEEventBase, GlobalHttpEvent, RequestModification } from '../decorators/nde-event.decorator';
import { GlobalHttpEventService } from '../services/global-http-event.service';

@Injectable()
@NDEEvent({
  stream: 'response',
  match: /\/AlmaItemRequest\?/,
  order: 10,
  description: 'This modifies item requests and responses. Format the office delivery comment and change the current Eisenhower pick up name.'
})
export class ItemRequestEvent extends NDEEventBase {
  constructor(
    globalHttp: GlobalHttpEventService
  ) {
    super(globalHttp);

  }

  override onRequest(method: string, url: string, headers: Record<string, string>, body: unknown): RequestModification | void {
    const data = JSON.parse(body as string);

    if (data) {
      if (data.genericCheckBox == "Yes") {
        delete data.genericCheckBox;

        data.comment = "Office Delivery Request: " + data.comment;

      }
      else {
        delete data.genericCheckBox;
      }
    }

    const mod: RequestModification = {
      method,
      url,
      headers,
      body: JSON.stringify(data)
    };

    return mod;
  }

  override onResponse(method: string, url: string, status: number, body: unknown): unknown {
    const data = body as any;

    if (data['services-arr'] && data['services-arr'].services) {
      data['services-arr'].services.forEach(function (service: { [x: string]: any[]; }) {
        if (service['groups-list-map']) {
          service['groups-list-map'].forEach(function (item) {
            if (item.pickupLocation) {
              item.pickupLocation.forEach(function (location: { key: string; value: string; }) {
                if (location.key === "126006350007861$$LIBRARY") {
                  location.value = "Milton S. Eisenhower Library - Annex";
                }
              });
            }
          });
        }
      });
    }
    return data;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
