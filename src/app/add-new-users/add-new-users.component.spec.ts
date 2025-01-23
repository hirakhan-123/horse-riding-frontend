import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewUsersComponent } from './add-new-users.component';

describe('AddNewUsersComponent', () => {
  let component: AddNewUsersComponent;
  let fixture: ComponentFixture<AddNewUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
