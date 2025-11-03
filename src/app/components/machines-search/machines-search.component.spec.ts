import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesSearchComponent } from './machines-search.component';

describe('MachinesSearchComponent', () => {
  let component: MachinesSearchComponent;
  let fixture: ComponentFixture<MachinesSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachinesSearchComponent]
    });
    fixture = TestBed.createComponent(MachinesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
