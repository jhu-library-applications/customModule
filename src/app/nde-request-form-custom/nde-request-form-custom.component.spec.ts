import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeRequestFormCustomComponent } from './nde-request-form-custom.component';

describe('NdeRequestFormCustomComponent', () => {
  let component: NdeRequestFormCustomComponent;
  let fixture: ComponentFixture<NdeRequestFormCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeRequestFormCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeRequestFormCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
