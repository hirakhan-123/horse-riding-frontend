import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTrainingComponent } from './add-new-training.component';

describe('AddNewTrainingComponent', () => {
  let component: AddNewTrainingComponent;
  let fixture: ComponentFixture<AddNewTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewTrainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
