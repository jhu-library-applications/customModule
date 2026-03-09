import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeSearchNoResultsCustomComponent } from './nde-search-no-results-custom.component';

describe('NdeSearchNoResultsCustomComponent', () => {
  let component: NdeSearchNoResultsCustomComponent;
  let fixture: ComponentFixture<NdeSearchNoResultsCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeSearchNoResultsCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeSearchNoResultsCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
