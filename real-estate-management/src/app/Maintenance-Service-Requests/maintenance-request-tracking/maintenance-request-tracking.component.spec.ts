import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceRequestTrackingComponent } from './maintenance-request-tracking.component';
import { MaintenanceRequestService } from '../services/maintenance-request.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaintenanceRequestTrackingComponent', () => {
  let component: MaintenanceRequestTrackingComponent;
  let fixture: ComponentFixture<MaintenanceRequestTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MaintenanceRequestTrackingComponent],
      providers: [MaintenanceRequestService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceRequestTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load requests on init', () => {
    const maintenanceRequestService = TestBed.inject(MaintenanceRequestService);
    const spy = spyOn(maintenanceRequestService, 'getRequests').and.callThrough();

    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
