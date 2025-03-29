import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from 'src/app/features/auth/components/register/register.component';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

jest.mock('src/app/features/auth/services/auth.service');

class MockRouter {
    navigate = jest.fn();
    url = 'sessions';
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let mockRouter: MockRouter;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(async () => {
    mockHttpClient = {
        post: jest.fn()
    } as any;
    mockRouter = new MockRouter();
    authService = new AuthService(mockHttpClient) as jest.Mocked<AuthService>;
    authService.register = jest.fn().mockReturnValue(of(void 0));
    
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    const firstNameInput = fixture.debugElement.query(By.css('input[formControlName="firstName"]')).nativeElement;
    const lastNameInput = fixture.debugElement.query(By.css('input[formControlName="lastName"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;

    emailInput.value = 'test@email.com';
    firstNameInput.value = 'John';
    lastNameInput.value = 'Doe';
    passwordInput.value = 'Password';

    emailInput.dispatchEvent(new Event('input'));
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const submitbtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitbtn.disabled).toBeFalsy();
  });

  it('should disable submit button when form is invalid', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitBtn.disabled).toBeTruthy();
  });

  it('should call register method when form is valid', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    const firstNameInput = fixture.debugElement.query(By.css('input[formControlName="firstName"]')).nativeElement;
    const lastNameInput = fixture.debugElement.query(By.css('input[formControlName="lastName"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;

    emailInput.value = 'test@email.com';
    firstNameInput.value = 'John';
    lastNameInput.value = 'Doe';
    passwordInput.value = 'Password';

    emailInput.dispatchEvent(new Event('input'));
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const registerResponse = void 0;
    authService.register.mockReturnValue(of(registerResponse));

    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    submitBtn.click();

    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith({
        email: 'test@email.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Password'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display error message when register fails', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    const firstNameInput = fixture.debugElement.query(By.css('input[formControlName="firstName"]')).nativeElement;
    const lastNameInput = fixture.debugElement.query(By.css('input[formControlName="lastName"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;

    emailInput.value = 'test@email.com';
    firstNameInput.value = 'John';
    lastNameInput.value = 'Doe';
    passwordInput.value = 'Password';

    emailInput.dispatchEvent(new Event('input'));
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const errorResponse = 'Registration failed';
    authService.register.mockReturnValue(throwError(() => new Error(errorResponse)));

    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    submitBtn.click();

    fixture.detectChanges();

    const errorElement =  fixture.debugElement.query(By.css('.error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toBe('An error occurred');
  })

});
