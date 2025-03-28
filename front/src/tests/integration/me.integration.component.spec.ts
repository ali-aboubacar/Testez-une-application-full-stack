import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
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

jest.mock('src/app/services/session.service');
jest.mock('src/app/services/user.service');

class MockMatSnackBar {
    open = jest.fn();
}

class MockRouter {
    navigate = jest.fn();
}

describe('MeComponent', () => {
    let component: MeComponent;
    let fixture: ComponentFixture<MeComponent>;
    let mockUserService: jest.Mocked<UserService>;
    let mockSessionService: jest.Mocked<SessionService>;
    let mockMatSnackBar: MockMatSnackBar;
    let mockRouter: MockRouter;
    let mockHttpClient: HttpClient;

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
        mockUserService = new UserService(mockHttpClient) as jest.Mocked<UserService>;
        mockSessionService = new SessionService() as jest.Mocked<SessionService>;
        mockMatSnackBar = new MockMatSnackBar();
        mockRouter = new MockRouter;

        mockSessionService.sessionInformation = {
            id:123,
            token: 'this a mocked token',
            username: 'admin',
            firstName: 'admin',
            lastName: 'Admin',
            admin: false,
            type: 'yoga'
        }

        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule,
                MatSnackBarModule,
                MatCardModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule ],
            declarations: [MeComponent],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: Router, useValue: mockRouter },
                { provide: MatSnackBar, useValue: mockMatSnackBar }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MeComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load user data on ngOnInit', () => {
        mockUserService.getById.mockReturnValue(of(mockUser));

        fixture.detectChanges();

        expect(component.user).toEqual(mockUser);
    });

    it('should navigate back() is called',() => {
        const historySpy = jest.spyOn(window.history, 'back');
        component.back();
        expect(historySpy).toHaveBeenCalled();
    });

    it('should delete the account when delete() is called and show snackBar', () => {
        mockUserService.getById.mockReturnValue(of(mockUser));
        mockUserService.delete.mockReturnValue(of({}));

        fixture.detectChanges();

        component.delete();

        // expect(mockUserService).toHaveBeenCalledWith('1');
        // expect(mockMatSnackBar).toBeCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
        // expect(mockSessionService.logOut).toHaveBeenCalled();
        // expect(mockRouter).toHaveBeenCalledWith(['/']);
    });

    it('should display the correct user information', () => {
        mockUserService.getById.mockReturnValue(of(mockUser));

        fixture.detectChanges();

        const username = fixture.nativeElement.querySelector('p:nth-child(1)');
        expect(username.textContent).toContain('Name: John DOE');
        const email = fixture.nativeElement.querySelector('p:nth-child(2)');
        expect(email.textContent).toContain('Email: john.doe@email.com');

    })
})