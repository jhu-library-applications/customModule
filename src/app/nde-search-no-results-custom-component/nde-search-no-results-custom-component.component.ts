import { Component, inject } from '@angular/core';
import { createFeatureSelector, Store } from '@ngrx/store';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

type SearchState = { searchParams: { q: string } };
export const selectSearchState = createFeatureSelector<SearchState>('Search');

@Component({
  selector: 'custom-nde-search-no-results-custom-component',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './nde-search-no-results-custom-component.component.html',
  styleUrl: './nde-search-no-results-custom-component.component.scss'
})
export class NdeSearchNoResultsCustomComponentComponent {
  public store = inject(Store);


  searchState$!: Observable<SearchState>;
  searchTerm$!: Observable<string>;
  ngOnInit(): void {
    this.searchState$ = this.store.select(selectSearchState);
    this.searchTerm$ = this.searchState$.pipe(
      map((state) => state.searchParams.q)
    );
  }



}
