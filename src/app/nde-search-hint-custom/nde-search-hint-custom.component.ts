import { Component, inject, OnInit } from '@angular/core';
import { createFeatureSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

type SearchState = { searchParams: { q: string } };
export const selectSearchState = createFeatureSelector<SearchState>('Search');

@Component({
  selector: 'custom-nde-search-hint-custom',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatCardModule, MatIconModule],
  templateUrl: './nde-search-hint-custom.component.html',
  styleUrl: './nde-search-hint-custom.component.scss'
})
export class NdeSearchHintCustomComponent implements OnInit {
  public store = inject(Store);

  searchState$!: Observable<SearchState>;
  searchTerm$!: Observable<string>;
  isAstmSearch$!: Observable<boolean>;

  readonly ASTM_COMPASS_URL = "https://databases.library.jhu.edu/databases/proxy/JHU05996";

  ngOnInit(): void {
    this.searchState$ = this.store.select(selectSearchState);
    this.searchTerm$ = this.searchState$.pipe(
      map((state) => state.searchParams.q)
    );

    this.isAstmSearch$ = this.searchTerm$.pipe(
      map((term) => this.isAstmSearch(term))
    );
  }

  isAstmSearch(term: string): boolean {
    if (!term) return false;
    return term.toLowerCase().includes("astm");
  }
}
