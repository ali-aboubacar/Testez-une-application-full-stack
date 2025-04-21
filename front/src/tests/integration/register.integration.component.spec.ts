import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from 'src/app/features/auth/components/register/register.component';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({ template: '' })
class DummyLoginComponent {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
   

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent,DummyLoginComponent],
      providers: [
        FormBuilder,
        AuthService
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyLoginComponent }
        ]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register API and navigate to login on success', () => {
    fillForm('test@email.com', 'John', 'Doe', 'Password');

    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    submitBtn.click();
    fixture.detectChanges();

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@email.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'Password'
    });

    req.flush({}); // Simulate success
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });


  it('should display error message on register API failure', () => {
    fillForm('test@email.com', 'John', 'Doe', 'Password');

    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    submitBtn.click();
    fixture.detectChanges();

    const req = httpMock.expectOne('api/auth/register');
    req.flush('Failed', { status: 500, statusText: 'Server Error' });

    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('An error occurred');
  });

  function fillForm(email: string, firstName: string, lastName: string, password: string) {
    const getInput = (formControlName: string) =>
      fixture.debugElement.query(By.css(`input[formControlName="${formControlName}"]`)).nativeElement;

    getInput('email').value = email;
    getInput('firstName').value = firstName;
    getInput('lastName').value = lastName;
    getInput('password').value = password;

    ['email', 'firstName', 'lastName', 'password'].forEach(name =>
      getInput(name).dispatchEvent(new Event('input'))
    );

    fixture.detectChanges();
  }

});
