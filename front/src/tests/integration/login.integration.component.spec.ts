import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, DebugElement, inject } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { LoginComponent } from 'src/app/features/auth/components/login/login.component';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { ListComponent } from 'src/app/features/sessions/components/list/list.component';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { SessionService } from 'src/app/services/session.service';

@Component({ template: '' })
class DummyComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        AuthService,
        SessionService
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: DummyComponent }
        ]),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    jest.spyOn(sessionService, 'logIn');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable submit button when form is invalid', () => {
    const submitBtn: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitBtn.nativeElement.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    setFormValues('test@email.com', 'Password123')

    const submitBtn: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitBtn.nativeElement.disabled).toBeFalsy();
  });

  it('should call login method when form is valid', fakeAsync(() => {
    setFormValues('test@email.com', 'Password123');

    const loginResponse: SessionInformation = { id: 1, token: 'valid_token' } as SessionInformation;
    component.submit();

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(loginResponse);

    tick();
    expect(sessionService.logIn).toHaveBeenCalledWith(loginResponse);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions'])
  }));

  it('should display error message when login fails', fakeAsync(() => {
    setFormValues('wrong@email.com', 'wrongPassword');

    const errorResponse = 'Invalid credentials';
    component.submit();

    const req = httpMock.expectOne('api/auth/login');
    req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });

    tick();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toBe('An error occurred');
  }));

  it('should hide/show password when eye iconis clicked', () => {
    const passwordInput: HTMLInputElement = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;
    const eyeIcon = fixture.debugElement.query(By.css('button[mat-icon-button]'));

    expect(passwordInput.type).toBe('password');

    eyeIcon.nativeElement.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');

    eyeIcon.nativeElement.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('password');
  });

  function setFormValues(email: string, password: string) {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;
    emailInput.value = email;
    passwordInput.value = password;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
});
