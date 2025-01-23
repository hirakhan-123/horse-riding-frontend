import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHorsesComponent } from './manage-horses.component';

describe('ManageHorsesComponent', () => {
  let component: ManageHorsesComponent;
  let fixture: ComponentFixture<ManageHorsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageHorsesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageHorsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
