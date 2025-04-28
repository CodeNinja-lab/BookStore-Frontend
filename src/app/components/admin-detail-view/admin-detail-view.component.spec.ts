import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailViewComponent } from './admin-detail-view.component';

describe('AdminDetailViewComponent', () => {
  let component: AdminDetailViewComponent;
  let fixture: ComponentFixture<AdminDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
