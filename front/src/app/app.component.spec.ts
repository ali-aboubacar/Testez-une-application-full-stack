import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';


describe('AppComponent', () => {
  let component: AppComponent;
  let sessionService: SessionService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers:[
        SessionService,
        { provide: Router, useValue: {navigate: jest.fn()} }
      ]
    }).compileComponents();

    component = TestBed.createComponent(AppComponent).componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('isLogged', () => {
    jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(true));

    component.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      expect(sessionService.$isLogged).toHaveBeenCalled();
    })
  })

  it('logOut', () => {
    jest.spyOn(sessionService, 'logOut');
    const routerSpy = jest.spyOn(router, 'navigate');

    component.logout();

    expect(sessionService.logOut).toHaveBeenCalled();
    expect(routerSpy).toBeCalledWith([''])
  })
});
