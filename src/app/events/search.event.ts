import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NDEEvent, NDEEventBase, GlobalHttpEvent } from '../decorators/nde-event.decorator';
import { GlobalHttpEventService } from '../services/global-http-event.service';

@Injectable()
@NDEEvent({
  stream: 'response',
  match: /delivery|pnxs/,
  order: 30,
  description: 'Modify the doc.pnx.display fields returned in search responses.'
})
export class SearchEvent extends NDEEventBase {

  // private storeSub: Subscription;

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
  override onResponse(method: string, url: string, status: number, body: unknown): unknown {
    const data = body as any;

    console.log("[EVENT!!!]" + JSON.stringify(data));
    
    return data;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // this.storeSub?.unsubscribe();
  }
}
