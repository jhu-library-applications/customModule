import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeSearchHintCustomComponent } from './nde-search-hint-custom.component';

describe('NdeSearchHintCustomComponent', () => {
  let component: NdeSearchHintCustomComponent;
  let fixture: ComponentFixture<NdeSearchHintCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeSearchHintCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeSearchHintCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
