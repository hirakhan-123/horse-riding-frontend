import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMemberComponent } from './event-member.component';

describe('EventMemberComponent', () => {
  let component: EventMemberComponent;
  let fixture: ComponentFixture<EventMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
