import { Injectable } from '@angular/core';
import { NDEEvent, NDEEventBase, GlobalHttpEvent } from '../decorators/nde-event.decorator';
import { GlobalHttpEventService } from '../services/global-http-event.service';
import { RequestModification } from '../decorators/nde-event.decorator';
@Injectable()
@NDEEvent({
  stream: 'request',
  match: /\/primaws\/rest\/priv\/ILSServices\/holdings(\/[^?]+)?\?/,
  order: 1,
  description: 'This increases the amount of items returned in holdings requests.'
})
export class HoldingsEvent extends NDEEventBase {

  constructor(
    globalHttp: GlobalHttpEventService
  ) {
    super(globalHttp);
  }

  override onRequest(method: string, url: string, headers: Record<string, string>, body: unknown): RequestModification | void {
    const data = JSON.parse(body as string);


    if (data.filters && typeof data.filters.noItem !== 'undefined') {
      data.filters.noItem = 500;
    }

    const mod: RequestModification = {
      method,
      url,
      headers,
      body: JSON.stringify(data)
    };

    return mod;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
