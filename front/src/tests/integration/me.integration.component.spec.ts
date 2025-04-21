import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MeComponent } from "src/app/components/me/me.component"
import { SessionService } from "src/app/services/session.service";
import { UserService } from "src/app/services/user.service";
import { expect } from '@jest/globals';
import { User } from "src/app/interfaces/user.interface";
import { of } from "rxjs";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";


describe('MeComponent', () => {
    let component: MeComponent;
    let fixture: ComponentFixture<MeComponent>;
    let httpMock: HttpTestingController;
    let sessionService: SessionService;

    const mockUser: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        password: 'Password123',
        admin: false,
        createdAt: new Date()
    };

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule,
                MatSnackBarModule,
                MatCardModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule ],
            declarations: [MeComponent],
            providers: [UserService,SessionService]
        }).compileComponents();

        fixture = TestBed.createComponent(MeComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        sessionService = TestBed.inject(SessionService);

        sessionService.sessionInformation = {
            id: 123,
            token: 'this a mocked token',
            username: 'admin',
            firstName: 'admin',
            lastName: 'Admin',
            admin: false,
            type: 'yoga'
        };
    });

    afterEach(()=>{
        httpMock.verify();
    });


    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load user data on ngOnInit', () => {
        fixture.detectChanges();

        const req = httpMock.expectOne(`api/user/${sessionService.sessionInformation?.id}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockUser);
        fixture.detectChanges();
        
        expect(component.user).toEqual(mockUser);

        const nameText = fixture.nativeElement.querySelector('p:nth-child(1)')?.textContent;
        expect(nameText).toContain('Name: John DOE');
        const email = fixture.nativeElement.querySelector('p:nth-child(2)');
        expect(email.textContent).toContain('Email: john.doe@email.com');
    });

    it('should navigate back() is called',() => {
        const historySpy = jest.spyOn(window.history, 'back');
        component.back();
        expect(historySpy).toHaveBeenCalled();
    });

    it('should delete the account when delete() is called and show snackBar', () => {
        fixture.detectChanges();

        const getReq = httpMock.expectOne(`api/user/${sessionService.sessionInformation?.id}`);
        getReq.flush(mockUser);

        fixture.detectChanges();
        component.delete();

        const deleteReq = httpMock.expectOne(`api/user/${sessionService.sessionInformation?.id}`);
        expect(deleteReq.request.method).toBe('DELETE');
        deleteReq.flush({});
        fixture.detectChanges();
    });

})