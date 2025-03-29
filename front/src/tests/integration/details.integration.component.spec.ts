import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { of } from 'rxjs';
import { DetailComponent } from 'src/app/features/sessions/components/detail/detail.component';
import { SessionApiService } from 'src/app/features/sessions/services/session-api.service';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';

class MockRouter {
  navigate = jest.fn();
  url = '/session/update/1';
}

class MockMatSnackBar {
  open = jest.fn();
}

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let sessionApiService: jest.Mocked<SessionApiService>;
  let teacherService: jest.Mocked<TeacherService>;
  let mockHttpClient: HttpClient;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockRouter: MockRouter;
  let mockMatSnackBar: MockMatSnackBar;

  beforeEach(async () => {
    sessionApiService = {
      detail: jest.fn().mockReturnValue(of({id:1, users: [], teacher_id:2})),
      unParticipate: jest.fn().mockReturnValue(of({})),
      all: jest.fn(),
      participate: jest.fn().mockReturnValue(of({})),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn().mockReturnValue(of({})),
  } as any;
  teacherService = new TeacherService(mockHttpClient) as jest.Mocked<TeacherService>;
  mockRouter = new MockRouter();
  mockMatSnackBar = new MockMatSnackBar();

  mockSessionService = {
    sessionInformation: {
      id:1,
      token: 'this a mocked token',
      username: 'admin',
      firstName: 'admin',
      lastName: 'Admin',
      admin: true,
      type: 'yoga'
  }
  } as jest.Mocked<SessionService>

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent], 
      providers: [
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: TeacherService, useValue: teacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter }, 
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } } } },
        { provide: SessionService, useValue: mockSessionService }
      ],
    })
      .compileComponents();
    
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when the button is clicked', () => {
    const spy = jest.spyOn(window.history,'back');

    const backBtn = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    expect(backBtn).not.toBeNull();

    backBtn.triggerEventHandler('click',null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call delete an navigate on successfull delete', () => {
    const deleteSpy = jest.spyOn(sessionApiService, 'delete').mockReturnValue(of({}));
    const navigateSpy = jest.spyOn(mockRouter,'navigate');
    const openSpy = jest.spyOn(mockMatSnackBar,'open');
    component.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['sessions'])
    expect(openSpy).toHaveBeenCalledWith('Session deleted !', 'Close', {duration: 3000});

  });

  it('should fetchSession on NgOninit', () => {
    const featchSessionSpy = jest.spyOn(sessionApiService, 'detail').mockReturnValue(of({id:1, users: [], teacher_id:2} as any));
    component.ngOnInit();
    expect(featchSessionSpy).toHaveBeenCalled();
  });

  it('should unparticipate from session when clicked', () => {
    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();

    const unParticipate = fixture.debugElement.query(By.css('button[mat-raised-button][color="warn"]'));
    expect(unParticipate).not.toBeNull();

    unParticipate.nativeElement.click();

    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1','1');
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
  });

  it('should participate from session when clicked', () => {
    component.isAdmin = false;
    component.isParticipate = false;
    fixture.detectChanges();
    const participate = fixture.debugElement.query(By.css('button[mat-raised-button]'));
    expect(participate).not.toBeNull();

    participate.nativeElement.click();

    expect(sessionApiService.participate).toHaveBeenCalledWith('1','1');
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
  });

});

