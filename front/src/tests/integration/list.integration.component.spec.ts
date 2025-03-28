import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { ListComponent } from 'src/app/features/sessions/components/list/list.component';
import { SessionApiService } from 'src/app/features/sessions/services/session-api.service';
import { SessionService } from 'src/app/services/session.service';


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionApiService: jest.Mocked<SessionApiService>;


  const mockSessionService = {
    sessionInformation: {
      admin: false
    }
  }

  beforeEach(async () => {
    sessionApiService = {
        all: jest.fn().mockReturnValue(of([
            { id: '1', name: 'Session 1', date: new Date(), description: 'test description 1' },
            { id: '2', name: 'Session 2', date: new Date(), description: 'test description 2' }
        ]))
    } as any;


    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule, RouterTestingModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display available sessions', () => {
    const sessionCards = fixture.debugElement.queryAll(By.css('.item'));
    expect(sessionCards.length).toBe(2);
  });

  it('should display session name and description', () => {
    const sessionTitle = fixture.debugElement.query(By.css('.item mat-card-title'));
    expect(sessionTitle.nativeElement.textContent).toContain('Session 1');
    const sessionDescription = fixture.debugElement.query(By.css('.item mat-card-content p'));
    expect(sessionDescription.nativeElement.textContent).toContain('test description 1')
  });

  it('should not display the "create" button for non-admin', () => {
    const createBtn =fixture.debugElement.query(By.css('button[routerLink="create"]'));
    expect(createBtn).toBeNull();
  });

  it('should display the "Create" button for admin user',() => {
    component['sessionService'].sessionInformation = {admin: true} as any;
    fixture.detectChanges();

    const createBtn =fixture.debugElement.query(By.css('button[routerLink="create"]'));
    expect(createBtn).not.toBeNull();
  });

  it('should navigate to the details page when "Details" button is clicked', async() => {
    await fixture.whenStable();
    const detailBtn = fixture.debugElement.query(By.css('button[ng-reflect-router-link*=detail]'));
    expect(detailBtn).toBeTruthy();

    expect(detailBtn.attributes['ng-reflect-router-link']).toContain('detail');
    detailBtn.nativeElement.click();
    fixture.detectChanges();

  });

});
