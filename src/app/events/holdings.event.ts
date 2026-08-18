import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NDEEvent, NDEEventBase, GlobalHttpEvent } from '../decorators/nde-event.decorator';
import { GlobalHttpEventService } from '../services/global-http-event.service';
import { RequestModification } from '../decorators/nde-event.decorator';
@Injectable()
@NDEEvent({
  stream: 'request',
  match: /\/primaws\/rest\/priv\/ILSServices\/holdings(\/[^?]+)?\?/,
  order: 1,
  description: ''
})
export class HoldingsEvent extends NDEEventBase {

  constructor(
    globalHttp: GlobalHttpEventService
  ) {
    super(globalHttp);

    // Subscribe to the ngrx store — the single source of truth.
    // When docs arrive, mutate titles in-place on the entity objects.
    // this.storeSub = this.searchState.selectAllDocs$()
    //   .subscribe(docs => this.transformDocsInStore(docs));
  }

  /**
   * Layer 1 response handler — mutates the XHR body BEFORE the host reads it.
   * This ensures the data enters the ngrx store already transformed.
   */

  override onRequest(method: string, url: string, headers: Record<string, string>, body: unknown): RequestModification | void {
    const data = JSON.parse(body as string);


    if (data.filters && typeof data.filters.noItem !== 'undefined') {
      data.filters.noItem = 500; // Retrieve 500 each call
    }

    const mod: RequestModification = { ...data };
    console.log(mod)
    return mod;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // this.storeSub?.unsubscribe();
  }
}
