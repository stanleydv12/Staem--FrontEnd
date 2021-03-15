import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagePromoComponent } from './admin-manage-promo.component';

describe('AdminManagePromoComponent', () => {
  let component: AdminManagePromoComponent;
  let fixture: ComponentFixture<AdminManagePromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManagePromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManagePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
