import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMediaPreviewComponent } from './user-media-preview.component';

describe('UserMediaPreviewComponent', () => {
  let component: UserMediaPreviewComponent;
  let fixture: ComponentFixture<UserMediaPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMediaPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMediaPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
