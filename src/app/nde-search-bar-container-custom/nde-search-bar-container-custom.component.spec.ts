import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeSearchBarContainerCustomComponent } from './nde-search-bar-container-custom.component';

describe('NdeSearchBarContainerCustomComponent', () => {
  let component: NdeSearchBarContainerCustomComponent;
  let fixture: ComponentFixture<NdeSearchBarContainerCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeSearchBarContainerCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeSearchBarContainerCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
