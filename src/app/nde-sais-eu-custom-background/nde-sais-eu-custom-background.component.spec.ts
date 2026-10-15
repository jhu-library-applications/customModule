import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeSaisEuCustomBackgroundComponent } from './nde-sais-eu-custom-background.component';

describe('NdeSaisEuCustomBackgroundComponent', () => {
  let component: NdeSaisEuCustomBackgroundComponent;
  let fixture: ComponentFixture<NdeSaisEuCustomBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NdeSaisEuCustomBackgroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NdeSaisEuCustomBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
