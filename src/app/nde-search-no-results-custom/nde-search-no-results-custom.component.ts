import { Component, inject, OnInit } from '@angular/core';
import { createFeatureSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

type SearchState = { searchParams: { q: string } };
export const selectSearchState = createFeatureSelector<SearchState>('Search');

@Component({
  selector: 'custom-nde-search-no-results-custom-component',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './nde-search-no-results-custom.component.html',
  styleUrl: './nde-search-no-results-custom.component.scss'
})
export class NdeSearchNoResultsCustomComponent implements OnInit {
  public store = inject(Store);

  searchState$!: Observable<SearchState>;
  searchTerm$!: Observable<string>;
  isDoi$!: Observable<boolean>;
  isIsbn$!: Observable<boolean>;
  doiLink$!: Observable<string | null>;
  isbnLink$!: Observable<string | null>;
  worldCatLink$!: Observable<string>;
  borrowDirectLink$!: Observable<string>;

  private readonly BASE_URL = 'https://catalyst.library.jhu.edu/discovery/openurl';
  private readonly WORLDCAT_BASE_URL = 'http://worldcat.org/search';
  private readonly BORROWDIRECT_BASE_URL = 'https://borrowdirect.reshare.indexdata.com/Search/Results';

  private readonly BASE_PARAMS = {
    institution: '01JHU_INST',
    vid: '01JHU_INST:nde',
    ctx_ver: 'Z39.88-2004',
    ctx_enc: 'info:ofi/enc:UTF-8',
    url_ver: 'Z39.88-2004',
    url_ctx_fmt: 'infofi/fmt:kev:mtx:ctx',
    rfr_id: 'info:sid/primo.exlibrisgroup.com:primo4-article-cLinker',
    isCitationLinker: 'Y',
    lang: 'en'
  };

  ngOnInit(): void {
    this.searchState$ = this.store.select(selectSearchState);
    this.searchTerm$ = this.searchState$.pipe(
      map((state) => state.searchParams.q)
    );

    this.isDoi$ = this.searchTerm$.pipe(
      map((term) => this.isDoi(term))
    );

    this.isIsbn$ = this.searchTerm$.pipe(
      map((term) => this.isIsbn(term))
    );

    this.doiLink$ = this.searchTerm$.pipe(
      map((term) => this.isDoi(term) ? this.generateDoiLink(term) : null)
    );

    this.isbnLink$ = this.searchTerm$.pipe(
      map((term) => this.isIsbn(term) ? this.generateIsbnLink(term) : null)
    );

    this.worldCatLink$ = this.searchTerm$.pipe(
      map((term) => this.generateWorldCatLink(term))
    );

    this.borrowDirectLink$ = this.searchTerm$.pipe(
      map((term) => this.generateBorrowDirectLink(term))
    );
  }

  isDoi(term: string): boolean {
    if (!term) return false;
    const doiPattern = /^10\.\d{4,}(\.\d+)*\/[^\s]+$/i;
    const doiUrlPattern = /^(https?:\/\/)?(dx\.)?doi\.org\/10\.\d{4,}(\.\d+)*\/[^\s]+$/i;
    return doiPattern.test(term.trim()) || doiUrlPattern.test(term.trim());
  }

  isIsbn(term: string): boolean {
    if (!term) return false;
    const cleanedTerm = term.replace(/[-\s]/g, '');
    const isbn10Pattern = /^[0-9]{9}[0-9Xx]$/;
    const isbn13Pattern = /^(978|979)[0-9]{10}$/;
    return isbn10Pattern.test(cleanedTerm) || isbn13Pattern.test(cleanedTerm);
  }

  extractDoi(term: string): string {
    const urlPattern = /^(https?:\/\/)?(dx\.)?doi\.org\//i;
    return term.trim().replace(urlPattern, '');
  }

  generateDoiLink(doi: string): string {
    const cleanDoi = this.extractDoi(doi);
    const params = new URLSearchParams({
      ...this.BASE_PARAMS,
      'rft.genre': 'article',
      'rft_val_fmt': 'info:ofi/fmt:kev:mtx:article',
      'rft_id': `info:doi/${cleanDoi}`,
      'rft.doi': cleanDoi
    });

    return `${this.BASE_URL}?${params.toString()}`;
  }

  generateIsbnLink(isbn: string): string {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    const params = new URLSearchParams({
      ...this.BASE_PARAMS,
      'rft.genre': 'book',
      'rft_val_fmt': 'info:ofi/fmt:kev:mtx:book',
      'rft.isbn': cleanIsbn
    });

    return `${this.BASE_URL}?${params.toString()}`;
  }

  generateWorldCatLink(term: string): string {
    if (!term) return this.WORLDCAT_BASE_URL;
    const params = new URLSearchParams({
      q: term.trim()
    });
    return `${this.WORLDCAT_BASE_URL}?${params.toString()}`;
  }

  generateBorrowDirectLink(term: string): string {
    if (!term) return this.BORROWDIRECT_BASE_URL;
    const params = new URLSearchParams({
      type: 'AllFields',
      lookfor: term.trim()
    });
    return `${this.BORROWDIRECT_BASE_URL}?${params.toString()}`;
  }
}
