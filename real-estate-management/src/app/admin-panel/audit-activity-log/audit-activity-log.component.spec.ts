import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditActivityLogComponent } from './audit-activity-log.component';

describe('AuditActivityLogComponent', () => {
  let component: AuditActivityLogComponent;
  let fixture: ComponentFixture<AuditActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditActivityLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
