import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeSearchNoResultsCustomComponentComponent } from './nde-search-no-results-custom-component.component';

describe('NdeSearchNoResultsCustomComponentComponent', () => {
  let component: NdeSearchNoResultsCustomComponentComponent;
  let fixture: ComponentFixture<NdeSearchNoResultsCustomComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeSearchNoResultsCustomComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeSearchNoResultsCustomComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
