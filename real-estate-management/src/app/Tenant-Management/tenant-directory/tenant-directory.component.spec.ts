import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantDirectoryComponent } from './tenant-directory.component';

describe('TenantDirectoryComponent', () => {
  let component: TenantDirectoryComponent;
  let fixture: ComponentFixture<TenantDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantDirectoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
