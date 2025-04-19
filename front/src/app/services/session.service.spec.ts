import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be login', () => {
    const user: SessionInformation = { 
      token: 'the token',
      type: 'bearer',
      id: 1,
      username: 'john',
      firstName: 'doe',
      lastName: 'le J',
      admin: false
     }

     const spyNext = jest.spyOn(service as any, 'next');

     service.logIn(user);

     expect(service.sessionInformation).toEqual(user);
     expect(service.isLogged).toBe(true);
     expect(spyNext).toHaveBeenCalled();

  });

  it('should not be login', () => {
     const spyNext = jest.spyOn(service as any, 'next');

     service.logOut();

     expect(service.sessionInformation).toBeUndefined();
     expect(service.isLogged).toBe(false);
     expect(spyNext).toHaveBeenCalled();

  });
});
