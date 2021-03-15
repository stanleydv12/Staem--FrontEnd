import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageGameComponent } from './admin-manage-game.component';

describe('AdminManageGameComponent', () => {
  let component: AdminManageGameComponent;
  let fixture: ComponentFixture<AdminManageGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
