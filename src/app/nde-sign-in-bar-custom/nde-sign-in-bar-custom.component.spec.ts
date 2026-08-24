import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeSignInBarCustomComponent } from './nde-sign-in-bar-custom.component';

describe('NdeSignInBarCustomComponent', () => {
  let component: NdeSignInBarCustomComponent;
  let fixture: ComponentFixture<NdeSignInBarCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeSignInBarCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeSignInBarCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
