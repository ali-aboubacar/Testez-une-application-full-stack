import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DebugElement, inject } from '@angular/core';
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

jest.mock('src/app/features/auth/services/auth.service');

class MockRouter {
    navigate = jest.fn();
    url = 'sessions';
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jest.Mocked<AuthService>;
  let sessionService: SessionService;
  let mockRouter: MockRouter;
  let mockHttpClient: jest.Mocked<HttpClient>;



  beforeEach(async () => {
    mockHttpClient = {
        post: jest.fn()
    } as any;
    mockRouter = new MockRouter();
    authService = new AuthService(mockHttpClient) as jest.Mocked<AuthService>;
    authService.login = jest.fn().mockReturnValue(of({id: 1, token:'valid token'}));

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authService },
        { provide: SessionService, useValue: { logIn: jest.fn() } },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
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
    const emailInput: HTMLInputElement = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    const passwordInput: HTMLInputElement = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;
    emailInput.value = 'test@email.com';
    passwordInput.value = 'Password';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const submitBtn: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitBtn.nativeElement.disabled).toBeFalsy();
  });

  it('should call login method when form is valid', () => {
    const emailInput: HTMLInputElement = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    const passwordInput: HTMLInputElement = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;
    emailInput.value = 'test@email.com';
    passwordInput.value = 'Password';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const loginResponse: SessionInformation = { id: 1, token: 'valid_token' } as SessionInformation;

    authService.login = jest.fn().mockReturnValue(of(loginResponse));
    component.submit();

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@email.com', password: 'Password' });
    expect(sessionService.logIn).toHaveBeenCalledWith(loginResponse);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions'])
  });

  it('should display error message when login fails', () => {
    const emailInput: HTMLInputElement = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    const passwordInput: HTMLInputElement = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;
    emailInput.value = 'test@email.com';
    passwordInput.value = 'Password';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const errorResponse = 'Invalid credentials';
    authService.login = jest.fn().mockReturnValue(throwError(() => new Error(errorResponse)));
    component.submit();

    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toBe('An error occurred');
  });

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
});
