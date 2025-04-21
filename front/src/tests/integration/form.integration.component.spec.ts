import { HttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed, flush } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, convertToParamMap, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FormComponent } from "src/app/features/sessions/components/form/form.component";
import { SessionApiService } from "src/app/features/sessions/services/session-api.service";
import { TeacherService } from "src/app/services/teacher.service";
import { expect } from '@jest/globals';
import { MatIconModule } from "@angular/material/icon";
import { SessionService } from "src/app/services/session.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { Session } from "src/app/features/sessions/interfaces/session.interface";

describe('formComponent', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    let httpMock: HttpTestingController;
    let mockRouter: Router;
    let mockSnackBar: MatSnackBar;


    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([]),
                MatIconModule,
                MatCardModule,
                MatFormFieldModule,
                MatSelectModule,
                BrowserAnimationsModule,
                MatInputModule,
                HttpClientTestingModule],
            declarations: [FormComponent],
            providers: [
                FormBuilder,
                SessionApiService,
                TeacherService,
                { provide: MatSnackBar, useValue: { open: jest.fn() } },
                { provide: ActivatedRoute, useValue: {snapshot: { paramMap: convertToParamMap({id: '1'}) }} },
                {
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
                  }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        mockRouter = TestBed.inject(Router);
        mockSnackBar = TestBed.inject(MatSnackBar);

        fixture.detectChanges();

        const teacherReq = httpMock.expectOne('api/teacher');
        teacherReq.flush([{ id:1, firstName: 'John', lastName: 'Doe' }])

    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch session details and populate form on update', () => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;

        const mockSessionData = {
            id: 1,
            name: 'session 1',
            date: new Date(),
            teacher_id: 1,
            description: 'test description session'
        }

        // 👇 Override the router's url BEFORE detectChanges
        const mockRouterInstance = TestBed.inject(Router);
        jest.spyOn(mockRouterInstance, 'url', 'get').mockReturnValue('/sessions/update/1');

        fixture.detectChanges();

        const sessionReq = httpMock.expectOne('api/session/1');
        sessionReq.flush(mockSessionData);

        const nameField = component.sessionForm?.get('name');
        expect(nameField?.value).toBe('session 1');
    });
});