import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyManagerDashboardComponent } from './property-manager-dashboard.component';

describe('PropertyManagerDashboardComponent', () => {
  let component: PropertyManagerDashboardComponent;
  let fixture: ComponentFixture<PropertyManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyManagerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
