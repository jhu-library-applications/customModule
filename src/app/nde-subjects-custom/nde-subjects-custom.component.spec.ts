import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeSubjectsCustomComponent } from './nde-subjects-custom.component';

describe('NdeSubjectsCustomComponent', () => {
  let component: NdeSubjectsCustomComponent;
  let fixture: ComponentFixture<NdeSubjectsCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeSubjectsCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeSubjectsCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
