import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';
import { MeComponent } from './me.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';

describe('MeComponent', () => {
  let component: MeComponent;
  let router: Router;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let matSnackBar: MatSnackBar;
  let sessionService: SessionService;

  const mockUser = {
    delete: jest.fn().mockReturnValue(of({}))
  }
  const mockSnackBar = {
    open: jest.fn()
  };
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn()
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
                { provide: Router, useValue: {navigate: jest.fn()} },
                { provide: SessionService, useValue: mockSessionService },
                { provide: MatSnackBar, useValue: mockSnackBar },
                { provide: UserService, useValue: mockUser }
              ],
    }).compileComponents();

    component = TestBed.createComponent(MeComponent).componentInstance;
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService)
    userService = TestBed.inject(UserService);
    matSnackBar = TestBed.inject(MatSnackBar);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('delete', () => {

    const routerSpy = jest.spyOn(router, 'navigate');
    const snackBar = jest.spyOn(matSnackBar, 'open');
    const userSpy = jest.spyOn(userService, 'delete');
    component.delete();

    expect(userSpy).toHaveBeenCalledWith('1');
    expect(snackBar).toBeCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
    expect(sessionService.logOut).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  })
  
});
