import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOverviewDashboardComponent } from './account-overview-dashboard.component';

describe('AccountOverviewDashboardComponent', () => {
  let component: AccountOverviewDashboardComponent;
  let fixture: ComponentFixture<AccountOverviewDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountOverviewDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountOverviewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
