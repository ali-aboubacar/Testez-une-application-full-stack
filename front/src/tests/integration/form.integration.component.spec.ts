import { HttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed, flush } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormComponent } from "src/app/features/sessions/components/form/form.component";
import { SessionApiService } from "src/app/features/sessions/services/session-api.service";
import { TeacherService } from "src/app/services/teacher.service";
import { expect } from '@jest/globals';
import { MatIconModule } from "@angular/material/icon";
import { SessionService } from "src/app/services/session.service";
import { of } from "rxjs";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Session } from "src/app/features/sessions/interfaces/session.interface";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

jest.mock('src/app/services/session.service');
jest.mock('src/app/services/user.service');

class MockMatSnackBar {
    open = jest.fn();
}

class MockRouter {
    navigate = jest.fn();
    url = '/session/update/1';
}


describe('formComponent', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    let sessionApiService: jest.Mocked<SessionApiService>;
    let teacherService: jest.Mocked<TeacherService>;
    let mockMatSnackBar: MockMatSnackBar;
    let mockRouter: MockRouter;
    let mockHttpClient: HttpClient;
    let mockSessionService: jest.Mocked<SessionService>;
    let httpTestingController: HttpTestingController



    beforeEach(async() => {
        sessionApiService = {
            detail: jest.fn(),
            unParticipate: jest.fn(),
            all: jest.fn(),
            participate: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        } as any;
        teacherService = new TeacherService(mockHttpClient) as jest.Mocked<TeacherService>;
        mockMatSnackBar = new MockMatSnackBar();
        mockRouter = new MockRouter();
        mockSessionService = new SessionService() as jest.Mocked<SessionService>;


        mockSessionService.sessionInformation = {
            id:1,
            token: 'this a mocked token',
            username: 'admin',
            firstName: 'admin',
            lastName: 'Admin',
            admin: true,
            type: 'yoga'
        }

        teacherService.all = jest.fn().mockReturnValue(of([{
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
        }]));


        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                RouterTestingModule,
                MatIconModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                HttpClientTestingModule],
            declarations: [FormComponent],
            providers: [
                FormBuilder,
                { provide: SessionApiService, useValue: sessionApiService },
                { provide: TeacherService, useValue: teacherService },
                { provide: MatSnackBar, useValue: mockMatSnackBar },
                { provide: Router, useValue: mockRouter }, 
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } } } },
                { provide: SessionService, useValue: mockSessionService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController);

    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch session details and populate form on update', () => {
        const mockSessionData = {
            id: 1,
            name: 'session 1',
            date: new Date(),
            teacher_id: 1,
            description: 'test description session'
        }
        sessionApiService.detail.mockReturnValue(of(mockSessionData as Session));
        component.ngOnInit();
        const nameField = component.sessionForm?.get('name');
        expect(nameField?.value).toBe('session 1');
    });

    it('should submit the form and update a session', () => {
        const mockSessionData = {
            id: 1,
            name: 'session 1',
            date: new Date(),
            teacher_id: 1,
            description: 'test description session',
        }
        component.onUpdate = true;
        component['id'] ='1';
        sessionApiService.update.mockReturnValue(of(mockSessionData as Session));
        
        component.sessionForm?.setValue(mockSessionData);
        component.submit();

        // expect(sessionApiService.update).toHaveBeenCalledWith('1',mockSessionData);
        expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', {duration: 3000});
        expect(mockRouter.navigate).toBeCalledWith(['sessions'])
    })

})