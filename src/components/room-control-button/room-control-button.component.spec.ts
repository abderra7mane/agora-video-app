import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomControlButtonComponent } from './room-control-button.component';

describe('RoomControlButtonComponent', () => {
  let component: RoomControlButtonComponent;
  let fixture: ComponentFixture<RoomControlButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomControlButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomControlButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
