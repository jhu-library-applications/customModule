import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeFetchItemJournalOptionHiderComponent } from './nde-fetch-item-journal-option-hider.component';

describe('NdeFetchItemJournalOptionHiderComponent', () => {
  let component: NdeFetchItemJournalOptionHiderComponent;
  let fixture: ComponentFixture<NdeFetchItemJournalOptionHiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeFetchItemJournalOptionHiderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeFetchItemJournalOptionHiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
