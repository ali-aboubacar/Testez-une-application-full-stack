import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { first, of } from 'rxjs';
import { DetailComponent } from 'src/app/features/sessions/components/detail/detail.component';
import { SessionApiService } from 'src/app/features/sessions/services/session-api.service';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';



describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let httpMock: HttpTestingController;
  const teacherResponse = { id: 2, firstName: 'John', lastName: 'Doe' };
  const sessionResponse = { id: 1, users: [], teacher_id: 2 };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent], 
      providers: [SessionApiService, TeacherService, {
        provide: SessionService,
        useValue: {
          sessionInformation: {
            id: 1,
            token: 'this a mocked token',
            username: 'admin',
            firstName: 'admin',
            lastName: 'Admin',
            admin: true,
            type: 'yoga'
          }
        }
      }, { 
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: convertToParamMap({id: '1'})
          }
        }
      }],
    })
      .compileComponents();
    
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController)

    fixture.detectChanges();

  });

  it('should create', () => {
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(sessionResponse);
    fixture.detectChanges();
    expect(component.session?.id).toBe(1)
  });

  it('should call delete an navigate on successfull delete', () => {
    httpMock.expectOne('api/session/1').flush(sessionResponse);
    fixture.detectChanges();

    const deleteBtn = component.delete();
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    fixture.detectChanges();

  });

  it('should unparticipate from session when clicked', () => {
    httpMock.expectOne('api/session/1').flush(sessionResponse);
    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();

    const unParticipate = fixture.debugElement.query(By.css('button[mat-raised-button][color="warn"]'));
    unParticipate.nativeElement.click();

    const req = httpMock.expectOne('api/session/1/participate/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

});

