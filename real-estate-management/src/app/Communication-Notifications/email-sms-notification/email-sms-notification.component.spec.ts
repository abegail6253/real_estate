import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSmsNotificationComponent } from './email-sms-notification.component';

describe('EmailSmsNotificationComponent', () => {
  let component: EmailSmsNotificationComponent;
  let fixture: ComponentFixture<EmailSmsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSmsNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSmsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
