import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeSignInCustomComponent } from './nde-sign-in-custom.component';

describe('NdeSignInCustomComponent', () => {
  let component: NdeSignInCustomComponent;
  let fixture: ComponentFixture<NdeSignInCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeSignInCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeSignInCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
