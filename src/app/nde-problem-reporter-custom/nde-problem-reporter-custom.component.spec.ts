import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeProblemReporterCustomComponent } from './nde-problem-reporter-custom.component';

describe('NdeProblemReporterCustomComponent', () => {
  let component: NdeProblemReporterCustomComponent;
  let fixture: ComponentFixture<NdeProblemReporterCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeProblemReporterCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeProblemReporterCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
