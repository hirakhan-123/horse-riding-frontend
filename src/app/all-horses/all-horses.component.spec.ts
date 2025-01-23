import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHorsesComponent } from './all-horses.component';

describe('AllHorsesComponent', () => {
  let component: AllHorsesComponent;
  let fixture: ComponentFixture<AllHorsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllHorsesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllHorsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
