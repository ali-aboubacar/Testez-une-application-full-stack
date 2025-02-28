import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[SessionApiService]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('return all sessions', () => {
    const date: Date = new Date;
    const mockSession: Session[] = [
      {
        id: 1,
        name: 'Session',
        description: 'description',
        date: date,
        teacher_id: 1,
        users: [1,2],
        createdAt: date,
        updatedAt: date,
      },
    ]

    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSession);
      expect(sessions.length).toBe(1);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession)
  });

  it('return details', () => {
    const date: Date = new Date;
    const mockSession: Session = 
      {
        id: 1,
        name: 'Session',
        description: 'description',
        date: date,
        teacher_id: 1,
        users: [1,2],
        createdAt: date,
        updatedAt: date,
      }


    service.detail("1").subscribe((session) => {
      expect(session).toEqual(mockSession);
      expect(session).toBe(1);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession)
  });
  
  it('delete session', () => {

    service.delete("1").subscribe();

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
  });

  it('create session', () => {
    const date: Date = new Date;
    const mockSession: Session = 
      {
        id: 1,
        name: 'Session',
        description: 'description',
        date: date,
        teacher_id: 1,
        users: [1,2],
        createdAt: date,
        updatedAt: date,
      }


    service.create(mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
      expect(session).toBe(1);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(mockSession)
  });

  it('update session', () => {
    const date: Date = new Date;
    const mockSession: Session = 
      {
        id: 1,
        name: 'Session',
        description: 'description',
        date: date,
        teacher_id: 1,
        users: [1,2],
        createdAt: date,
        updatedAt: date,
      }


    service.update('1',mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
      expect(session).toBe(1);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession)
  });

  it('update session', () => {
    service.participate('1','1').subscribe();

    const req = httpMock.expectOne('api/session/1/participate/1');
    expect(req.request.method).toBe('POST');
  });

  it('update session', () => {
    service.unParticipate('1','1').subscribe();

    const req = httpMock.expectOne('api/session/1/participate/1');
    expect(req.request.method).toBe('DELETE');
  });

});
