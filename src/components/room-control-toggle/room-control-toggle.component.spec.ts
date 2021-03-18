import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomControlToggleComponent } from './room-control-toggle.component';

describe('RoomControlToggleComponent', () => {
  let component: RoomControlToggleComponent;
  let fixture: ComponentFixture<RoomControlToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomControlToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomControlToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
